const express = require('express');
const router = express.Router();
const { body, param, query } = require('express-validator');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

// getAll /api/dish
// pagination
router.get(
    '/',
    /* query(stuff), authByToken, stuff, */
    async (req, res) => {
        const dishes = await prisma.dish.findMany({
            include: {
                meals: true
            }
        });
        res.json(dishes);
    }
);

// get:id /api/dish/:id
router.get('/:id', async (req, res) => {
    const { id } = req.params;
    const dish = await prisma.dish.findUnique({
        where: {
            id: parseInt(id)
        },
        include: {
            meals: true
        }
    });
    res.json(dish);
});

// Search /api/dish/search/:name
router.get(
    '/search/:name',
    body('name').isString(),
    async (req, res) => {
        const { name } = req.params;
        const dish = await prisma.dish.findMany({
            where: {
                name: {
                    contains: name
                }
            },
            include: {
                meals: true
            }
        });
        res.json(dish);
    }
);

// Create /api/dish
router.post('/', async (req, res) => {
    const { name } = req.body;
    const dish = await prisma.dish.create({
        data: {
            name
        }
    });
    res.json(dish);
});

// UPDATE?

// DELETE /api/dish/:id
router.delete('/:id', param('id').isInt(), async (req, res) => {
    const { id } = req.params;
    const dish = await prisma.dish.delete({
        where: {
            id: parseInt(id)
        }
    });

    // delete all meals with this dishId
    const meal = await prisma.meal.deleteMany({
        where: {
            dishId: parseInt(id)
        }
    });
    res.json(dish);
});

module.exports = router;