/**
 * Генерирует userId из username
 * @param username имя пользователя
 * @returns userId в формате lowercase с заменой пробелов на подчеркивания
 */
export const generateUserId = (username: string): string => {
    return username.toLowerCase().replace(/\s+/g, '_');
}; 