// Default : value only save in memory
type TCacheType = 'LocalStorage' | 'SessionStorage';

export type TCacheConfig = {
    type?: TCacheType;
    key: string;
};

export type TCacheSolution = { [key in TCacheType]: () => Storage };
