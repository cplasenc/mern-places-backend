const express = require('express');

const router = express.Router();

const DUMMY_PLACES = [
    {
        id: '1',
        title: 'titulo',
        descriptiom: 'descripcion',
        location: {
            lat: 40.7484,
            lng: -73.9871
        },
        adress: 'direccion',
        creator: 'u1' 
    }
]

router.get('/:placeId', (req, res, next) => {
    const placeId = req.params.placeId;
    const place = DUMMY_PLACES.find(p => {
        return p.id = placeId;
    });
    res.json({ place });
});



module.exports = router;