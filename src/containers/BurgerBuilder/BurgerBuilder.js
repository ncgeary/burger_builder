import React, {Component} from 'react';

import Aux from '../../hoc/Aux1/Aux1';
import Burger from '../../components/Burger/Burger';
import BuildControls from '../../components/Burger/BuildControls/BuildControls';
import Modal from '../../components/UI/Modal/Modal';
import OrderSummary from '../../components/Burger/OrderSummary/OrderSummary';
import Spinner from '../../components/UI/Spinner/Spinner'
import withErrorHandler from '../../hoc/withErrorHandler/withErrorHandler';

import axios from '../../axios-orders';

const Ingredient_Prices = {
    salad: 0.4,
    bacon: 1,
    cheese:0.5,
    meat:3
};

class BurgerBuilder extends Component {

    state = {
        ingredients: null,
        totalPrice: 5,
        purchaseable:true,
        purchasing:false,
        loading:false,
        error:false
    }

    componentDidMount () {
      axios.get('https://react-my-burger-7799e.firebaseio.com/ingredients.json')
        .then(response=>{
          this.setState({ingredients: response.data});
        })
        .catch(error=>{
          this.setState({error:true})
        });


    }
    updatePurchaseState (ingredients) {

        //creates an array of ingredients
        const sum = Object.keys(ingredients)
            .map(igKey => {
                return ingredients[igKey];
            })
            .reduce((sum, el)=>{
                return sum + el;
            }, 0);
        this.setState({purchaseable: sum>0});
    }

    addIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];
        const updatedCount = oldCount + 1;

        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;

        const priceAddition = Ingredient_Prices[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice+ priceAddition;
        this.setState({totalPrice: newPrice, ingredients:updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    }

    removeIngredientHandler = (type) => {
        const oldCount = this.state.ingredients[type];

        if(oldCount <= 0){
            return;
        }
        const updatedCount = oldCount - 1;

        const updatedIngredients = {
            ...this.state.ingredients
        };

        updatedIngredients[type] = updatedCount;

        const priceDeduction = Ingredient_Prices[type];
        const oldPrice = this.state.totalPrice;
        const newPrice = oldPrice - priceDeduction;
        this.setState({totalPrice: newPrice, ingredients:updatedIngredients})
        this.updatePurchaseState(updatedIngredients);
    }

    purchaseHandler = () => {
      this.setState({purchasing: true});
    }

    purchaseCancelHandler = () => {
      this.setState({purchasing: false});
    }

    purchaseContinueHandler = () => {
      //alert('YOU CONTINUE');
    //   this.setState({loading: true})
    //   const order = {
    //     ingredients: this.state.ingredients,
    //     //should recalculate price on server
    //     price: this.state.totalPrice,
    //     customer:{
    //       name: 'Nick Geary',
    //       address:{
    //         street:'teststreet',
    //         zipCode:'14141',
    //         country: 'USA'
    //       },
    //       email: 'test@test.com'
    //     },
    //     deliveryMethod:'fastest'
    //   }
    //   axios.post('/orders.json', order)
    //     .then(response => {
    //       this.setState({loading:false, purchasing: false});
    //     })
    //     .catch(error => {
    //       this.setState({loading:false, purchasing: false});
    //     });
        this.props.history.push('/checkout');
    }

    render (){
        const disableInfo = {
            ...this.state.ingredients
        };
        for (let key in disableInfo){
            disableInfo[key] = disableInfo[key] <= 0
        }
        //{salad: true, meat: false,...}


        let orderSummary = null;

        let burger = this.state.error ? <p> Ingredients can't be loaded!</p> : <Spinner />;

        if (this.state.ingredients) {
          burger = (
            <Aux>
              <Burger ingredients={this.state.ingredients} />

              <BuildControls
                  ingredientAdded={this.addIngredientHandler}
                  ingredientRemove={this.removeIngredientHandler}
                  disabled={disableInfo}
                  purchaseable={this.state.purchaseable}
                  ordered={this.purchaseHandler}
                  price={this.state.totalPrice}/>
            </Aux>
        );
        orderSummary = <OrderSummary
          ingredients={this.state.ingredients}
          price={this.state.totalPrice}
          purchaseCancelled = {this.purchaseCancelHandler}
          purchaseContinue={this.purchaseContinueHandler}
          />;
      }

      if (this.state.loading) {
        orderSummary = <Spinner />
      }

        return (
            <Aux>
                <Modal show={this.state.purchasing} modalClosed = {this.purchaseCancelHandler}>
                  {orderSummary}
                </Modal>

                {burger}

            </Aux>
        );
    }
}

export default withErrorHandler(BurgerBuilder, axios);
