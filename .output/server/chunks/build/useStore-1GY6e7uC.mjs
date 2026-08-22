import { f as useNuxtApp } from '../virtual/entry.mjs';

//#region app/composables/useStore.ts
function useStore() {
	const api = useNuxtApp().$api;
	const getProducts = (eventId) => api(`/store/events/${eventId}/products`);
	const getCart = (eventId) => api(`/store/events/${eventId}/cart`);
	const addCartItem = (eventId, productId, quantity = 1) => api(`/store/events/${eventId}/cart/items`, {
		method: "POST",
		body: {
			product_id: productId,
			quantity
		}
	});
	const removeCartItem = (eventId, productId) => api(`/store/events/${eventId}/cart/items/${encodeURIComponent(productId)}`, { method: "DELETE" });
	const checkout = (eventId) => api(`/store/events/${eventId}/checkout`, { method: "POST" });
	return {
		getProducts,
		getCart,
		addCartItem,
		removeCartItem,
		checkout
	};
}

export { useStore as u };
//# sourceMappingURL=useStore-1GY6e7uC.mjs.map
