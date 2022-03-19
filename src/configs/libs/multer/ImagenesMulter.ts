import multer from './multer';

export const DeliveryMan = multer.fields([
    {
        name: 'photo_seguro',
        maxCount: 1
    },
    {
        name: 'photo_licencia',
        maxCount: 1
    },
]);