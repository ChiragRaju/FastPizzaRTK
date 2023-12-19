import { useState } from "react";
import { createOrder } from "../../services/apiRestaurant";
import { redirect, useActionData, useNavigation } from "react-router-dom";

// https://uibakery.io/regex-library/phone-number
const isValidPhone = (str) =>
  /^\+?\d{1,4}?[-.\s]?\(?\d{1,3}?\)?[-.\s]?\d{1,4}[-.\s]?\d{1,4}[-.\s]?\d{1,9}$/.test(
    str
  );

const fakeCart = [
  {
    pizzaId: 12,
    name: "Mediterranean",
    quantity: 2,
    unitPrice: 16,
    totalPrice: 32,
  },
  {
    pizzaId: 6,
    name: "Vegetale",
    quantity: 1,
    unitPrice: 13,
    totalPrice: 13,
  },
  {
    pizzaId: 11,
    name: "Spinach and Mushroom",
    quantity: 1,
    unitPrice: 15,
    totalPrice: 15,
  },
];

function CreateOrder() {
  // const [withPriority, setWithPriority] = useState(false);
  const cart = fakeCart;
  const navigation=useNavigation()
  const isSubmitting=navigation.state==='submitting'
  const formErrors=useActionData();

  return (
    <div className="container mx-auto p-8">
      <h2 className="text-3xl font-bold mb-4">Ready to order? Let's go!</h2>

      <form className="max-w-md mx-auto" method="POST">
        <div className="mb-4">
          <label className="block text-gray-700">First Name</label>
          <input className="w-full border p-2" type="text" name="customer" required />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Phone number</label>
          <div>
            <input className="w-full border p-2" type="tel" name="phone" required />
          </div>
          {formErrors?.phone && <p className="text-red-500">{formErrors.phone}</p>}
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Address</label>
          <div>
            <input className="w-full border p-2" type="text" name="address" required />
          </div>
        </div>

        <div className="mb-4">
          <input
            className="mr-2"
            type="checkbox"
            name="priority"
            id="priority"
          />
          <label htmlFor="priority" className="text-gray-700">
            Want to give your order priority?
          </label>
        </div>

        <div>
          <input type="hidden" name="cart" value={JSON.stringify(cart)} />
          <button
            className={`bg-blue-500 text-white px-4 py-2 rounded ${
              isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Placing Order' : 'Order Now'}
          </button>
        </div>
      </form>
    </div>
  );
}

export const action = async ({ request }) => {
  const formData = await request.formData();
  console.log("Form data: ", formData);

  const data = Object.fromEntries(formData);
  console.log(data);
  const order = {
    ...data,
    cart: JSON.parse(data.cart),
    priority: data.priority === "on",
  };
  const errors={}
  if(!isValidPhone(order.phone))
  errors.phone='Please give your correct phone number';
  
  if(Object.keys(errors).length>0) return errors;
  const newOrder = await createOrder(order);
  
  return redirect(`/order/${newOrder.id}`);
};

export default CreateOrder;
