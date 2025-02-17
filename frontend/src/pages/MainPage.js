import BasicMenu from '../layouts/BasicMenu.js';
import BasicFooter from '../layouts/BasicFooter.js'
import MainPromotion from '../components/main/MainPromotion.js';
import MainProduct from '../components/main/MainProduct.js';
import MainEvent from '../components/main/MainEvent.js';
import MainEventList from '../components/main/MainEventList.js';


const MainPage = () => {
  return (


   
      
   <>
      <BasicMenu></BasicMenu>
      <MainPromotion></MainPromotion>
      <MainProduct></MainProduct> 
      <MainEvent></MainEvent>
      <MainEventList></MainEventList>
      <BasicFooter/>


      
   </>               
    
   );
}
 
export default MainPage;