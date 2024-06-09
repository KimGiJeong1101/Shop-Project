import CartComponent from "../components/cart/CartComponent";
import BasicLayout from "../layouts/BasicLayout";

const CartPage = () => {
    return (
        <BasicLayout>
            <div>
                <CartComponent/>
            </div>
        </BasicLayout>
    );
}

export default CartPage;