export const cleanImageUrl = (url: string) => {
    return url.split('/revision/')[0];
};
