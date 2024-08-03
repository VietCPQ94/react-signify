import { ElementRef, memo, MouseEvent, useCallback, useEffect, useRef } from 'react';
import { HardWrapCore } from '../signify-core/signify.core';
import './index.css';

let index = 100;

const getRandomPastelColor = () => {
    const r = Math.floor(Math.random() * 128);
    const g = Math.floor(Math.random() * 128);
    const b = Math.floor(Math.random() * 128);
    return `rgb(${r}, ${g}, ${b})`;
};

export const devTool = <T,>(HardWrap: ReturnType<typeof HardWrapCore<T>>) =>
    memo(
        ({ name }: { name: string }) => {
            const popup = useRef<HTMLDivElement | null>(null);
            let isDragging = false;
            let isResizing = false;
            let offsetX = 0;
            let offsetY = 0;
            let renderCount = 0;

            useEffect(() => {
                const mouseMove = (e: globalThis.MouseEvent) => {
                    if (isDragging && popup.current) {
                        popup.current.style.left = `${e.clientX - offsetX}px`;
                        popup.current.style.top = `${e.clientY - offsetY}px`;
                    }

                    if (isResizing && popup.current) {
                        const rect = popup.current.getBoundingClientRect();

                        const newWidth = e.clientX - rect.left;
                        const newHeight = e.clientY - rect.top;

                        if (newWidth > 100) {
                            popup.current.style.width = `${newWidth + 10}px`;
                        }

                        if (newHeight > 100) {
                            popup.current.style.height = `${newHeight + 10}px`;
                        }
                    }
                };

                const mouseUp = () => {
                    isDragging = false;
                    isResizing = false;
                    document.body.style.cursor = 'default';
                };

                document.addEventListener('mousemove', mouseMove);
                document.addEventListener('mouseup', mouseUp);

                return () => {
                    document.removeEventListener('mousemove', mouseMove);
                    document.removeEventListener('mouseup', mouseUp);
                };
            }, []);

            const headerMouseDown = useCallback(({ clientX, clientY }: { clientX: number; clientY: number }) => {
                if (popup.current) {
                    isDragging = true;
                    popup.current.style.zIndex = `${index++}`;
                    offsetX = clientX - popup.current?.offsetLeft;
                    offsetY = clientY - popup.current?.offsetTop;
                }
            }, []);

            const resizeMouseDown = useCallback((e: MouseEvent<ElementRef<'div'>>) => {
                isResizing = true;
                document.body.style.cursor = 'se-resize';
                e.preventDefault();
            }, []);

            const handleFontSize = useCallback(
                (isUp: boolean) => () => {
                    if (popup.current) {
                        if (!popup.current.style.fontSize) {
                            popup.current.style.fontSize = '12px';
                        }
                        popup.current.style.fontSize = Number(popup.current.style.fontSize.replace('px', '')) + (isUp ? 2 : -2) + 'px';
                    }
                },
                []
            );

            const syntaxHighlight = useCallback((json: string) => {
                if (typeof json != 'string') {
                    json = JSON.stringify(json, undefined, 2);
                }
                json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
                // eslint-disable-next-line
                return json.replace(/("(\\u[a-zA-Z0-9]{4}|\ $^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g, function (match) {
                    let cls = 'number';
                    if (/^"/.test(match)) {
                        if (/:$/.test(match)) {
                            cls = 'key';
                        } else {
                            cls = 'string';
                        }
                    } else if (/true|false/.test(match)) {
                        cls = 'boolean';
                    } else if (/null/.test(match)) {
                        cls = 'null';
                    }
                    return '<span class="signify_popup_json_' + cls + '">' + match + '</span>';
                });
            }, []);

            return (
                <div ref={popup} className="signify_popup">
                    <div style={{ backgroundColor: getRandomPastelColor() }} className="signify_popup_header" onMouseDown={headerMouseDown}>
                        <label className="signify_popup_header_label">
                            <HardWrap>
                                {n => (
                                    <>
                                        {name} - {++renderCount}
                                    </>
                                )}
                            </HardWrap>
                        </label>
                        <span className="signify_popup_header_button" onClick={handleFontSize(true)} dangerouslySetInnerHTML={{ __html: '&bigtriangleup;' }}></span>
                        <span className="signify_popup_header_button" onClick={handleFontSize(false)} dangerouslySetInnerHTML={{ __html: '&bigtriangledown;' }}></span>
                    </div>
                    <HardWrap>{(n: T) => <pre className="signify_popup_json_viewer" dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(n, null, 2)) }}></pre>}</HardWrap>

                    <div onMouseDown={resizeMouseDown} className="signify_popup_resizer"></div>
                </div>
            );
        },
        () => true
    );
