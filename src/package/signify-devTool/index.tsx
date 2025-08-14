import { ElementRef, memo, MouseEvent, useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { getCookie, setCookie } from '../utils/cookies';
import './index.css';

let index = 100;

const getRandomPastelColor = () => {
    const r = Math.floor(Math.random() * 128),
        g = Math.floor(Math.random() * 128),
        b = Math.floor(Math.random() * 128);
    return `rgb(${r}, ${g}, ${b})`;
};

type TDevtool = { name: string; color?: string; item: any };

export const DevTool = memo(
    ({ name, color, item }: TDevtool) => {
        const popup = useRef<HTMLDivElement | null>(null);
        let nameCookies = `rs-${name}`,
            isDragging = false,
            isResizing = false,
            offsetX = 0,
            offsetY = 0,
            renderCount = 0;

        useLayoutEffect(() => {
            if (popup.current) {
                const { x, y, h, w }: { [key: string]: string } = JSON.parse(getCookie(nameCookies) ?? '{}');
                x && (popup.current.style.left = x);
                y && (popup.current.style.top = y);
                w && (popup.current.style.width = w);
                h && (popup.current.style.height = h);
            }
        }, []);

        useEffect(() => {
            const mouseMove = (e: globalThis.MouseEvent) => {
                if (isDragging && popup.current) {
                    popup.current.style.left = `${e.clientX - offsetX}px`;
                    popup.current.style.top = `${e.clientY - offsetY}px`;
                }

                if (isResizing && popup.current) {
                    const rect = popup.current.getBoundingClientRect();

                    const newWidth = e.clientX - rect.left,
                        newHeight = e.clientY - rect.top;

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
                if (popup.current) {
                    setCookie(
                        nameCookies,
                        JSON.stringify({
                            x: popup.current.style.left,
                            y: popup.current.style.top,
                            w: popup.current.style.width,
                            h: popup.current.style.height
                        })
                    );
                }
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
                <div style={{ backgroundColor: color ?? getRandomPastelColor() }} className="signify_popup_header" onMouseDown={headerMouseDown}>
                    <label className="signify_popup_header_label">
                        <item.HardWrap>
                            {() => (
                                <>
                                    {name} - {++renderCount}
                                </>
                            )}
                        </item.HardWrap>
                    </label>
                    <span className="signify_popup_header_button" onClick={handleFontSize(true)} dangerouslySetInnerHTML={{ __html: '&bigtriangleup;' }}></span>
                    <span className="signify_popup_header_button" onClick={handleFontSize(false)} dangerouslySetInnerHTML={{ __html: '&bigtriangledown;' }}></span>
                </div>
                <item.HardWrap>{(n: any) => <pre className="signify_popup_json_viewer" dangerouslySetInnerHTML={{ __html: syntaxHighlight(JSON.stringify(n, null, 2)) }}></pre>}</item.HardWrap>

                <div onMouseDown={resizeMouseDown} className="signify_popup_resizer"></div>
            </div>
        );
    },
    () => true
);
