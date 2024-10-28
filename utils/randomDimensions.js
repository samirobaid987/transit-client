export function generateRandomDimensions(quantity = 1) {
    return {
        length: Math.random() * 50 * quantity,
        width: Math.random() * 30 * quantity,
        height: Math.random() * 20 * quantity,
        weight: Math.random() * 10 * quantity
    };
}