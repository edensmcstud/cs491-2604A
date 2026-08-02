console.log("cartRoutes.js LOADED");

const express = require("express");
const router = express.Router();

const authenticate = require("../middleware/auth");
const requirePermission = require("../middleware/requirePermission");

const cartController = require("../controllers/cartController");

/**
 * ============================
 * CART ROUTES (Customer Only)
 * ============================
 *
 * Permissions required:
 *   module: "cart"
 *   action: "use"
 *
 * Add this permission to the Customer role:
 *   cart | use
 *
 * Or, if you prefer:
 *   orders | create
 *   orders | read
 *
 * But "cart/use" is the cleanest.
 */

/**
 * GET /cart
 * Load current user's cart
 */
router.get(
    "/",
    authenticate,
    requirePermission("cart", "use"),
    cartController.getCart
);

/**
 * POST /cart/add
 * Add a book to the cart
 */
router.post(
    "/add",
    authenticate,
    requirePermission("cart", "use"),
    cartController.addToCart
);

/**
 * DELETE /cart/remove/:book_id
 * Remove a book from the cart
 */
router.delete(
    "/remove/:book_id",
    authenticate,
    requirePermission("cart", "use"),
    cartController.removeFromCart
);

/**
 * DELETE /cart
 * Clear the entire cart
 */
router.delete(
    "/",
    authenticate,
    requirePermission("cart", "use"),
    cartController.clearCart
);
/**
 * DELETE individual item from /cart
 * Clear the entire cart
 */
router.delete(
    "/decrement/:book_id",
    authenticate,
    requirePermission("cart", "use"),
    cartController.decrementItem
);

/**
 * POST /cart/checkout
 * Convert cart → order + order_items
 */
router.post(
    "/checkout",
    authenticate,
    requirePermission("cart", "use"),
    cartController.checkout
);
module.exports = router;