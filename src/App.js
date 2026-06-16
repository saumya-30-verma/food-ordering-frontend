import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [foods, setFoods] = useState([]);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedFood, setSelectedFood] = useState(null);
  const [cart, setCart] = useState([]);
  const [editId, setEditId] = useState(null);
  const [stats, setStats] = useState({
    totalFoods: 0,
    fastFood: 0,
    chinese: 0,
    desert: 0
  });

  const getFoods = ()=> {
       fetch("http://localhost:5000/foods")
    .then((res) => res.json())
    .then((data) => {
      setFoods(data);
    });
  }

  const getStats = async() => {
    const response = await fetch("http://localhost:5000/test")
    const data = await response.json();
    setStats(data);
  }
  
  useEffect(() => {
    getFoods();
    getStats();
  }, [])

  const addFood = async () => {
     console.log({
    name,
    price,
    category,
    image,
    description
  });
    const response = await fetch("http://localhost:5000/foods", {
      method: "POST",
      headers: {
        "Content-type": "application/json"
      },
      body: JSON.stringify({
        name,
        price,
        category,
        image,
        description
      })
    });

    const data = await response.json();
    console.log(data);
    getFoods();

    setName("");
    setPrice("");
  }

  const handleEdit = (food)=> {
    setName(food.name);
    setPrice(food.price);
    setEditId(food._id);
  }
  const deletefood = async(id)=> {
      await fetch(`http://localhost:5000/deletefood/${id}`, {
        method: "DELETE"
      });
      getFoods();
      console.log("food deleted")
    };

    const updateFood = async()=> {
      await fetch(`http://localhost:5000/foods/${editId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name, 
          price,
          description,
          category
        })
      });
      getFoods();

      setName("");
      setPrice("");
      setEditId(null);
    }
    const addToCart = (food)=> {
      const existingItem = cart.find((item) => item._id === food._id);
      // console.log(existingItem);

      if(existingItem) {
        setCart(cart.map ((item) => {
          if (item._id === food._id) {
            return {
              ...item, quantity: item.quantity + 1 
            };
          }
          return item;
        }))
      } else {
        console.log("Add New Item");
         setCart([...cart, {
          ...food,
          quantity: 1
         }]);
      }
     
    };
    const removeFromCart =(id) => {
      const updatedCart = cart.filter((item) => item._id !== id);
      setCart(updatedCart);
    }
    // useEffect(() => {
    //   console.log("cart updated:", cart);
    // }, [cart])

    useEffect(() => {
      console.log(selectedFood)
    }, [selectedFood]);
    
    

    const filteredFoods = foods.filter((food) => {
      const searchMatch = food.name.toLowerCase().includes(search.toLowerCase());

      const categoryMatch = selectedCategory === "All" || food.category === selectedCategory;

      return searchMatch && categoryMatch;
    }
      
    );

    const totalPrice = cart.reduce((total, item) => {
      return total+ (item.price * item.quantity)
    }, 0);
      
  return (
    <div className='container'>
      <h1>Food List</h1>
      <h2>total Foods: {stats.totalFoods}</h2>

      <input
         type='text'
         value={name}
         onChange={(e) => setName(e.target.value)}
         onKeyDown={(e) => {
          if (e.key === "Enter") {
            editId ? updateFood() : addFood();
          }
         }}
         placeholder='Enter food name'
       />

        <input
         type='text'
         value={search}
         onChange={(e) => setSearch(e.target.value)}
         placeholder='Search Food'
       />

       <input
         type='Number'
         value={price}
         onChange={(e) => setPrice(e.target.value)}
         onKeyDown={(e) => {
          if(e.key === "Enter") {
            editId ? updateFood() : addFood();
          }
         }}
         placeholder='Enter price'
       />
        
        <input
         type='text'
         value={category}
         onChange={(e) => setCategory(e.target.value)}
         onKeyDown={(e) => {
          if(e.key === "Enter") {
            editId ? updateFood() : addFood();
          }
         }}
         placeholder='Enter category'
       />

       <input
         type='text'
         value={description}
         onChange={(e) => setDescription(e.target.value)}
         onKeyDown={(e) => {
          if(e.key === "Enter") {
            editId ? updateFood() : addFood();
          }
         }}
         placeholder='Enter description'
       />

       <input
         type='text'
         value={image}
         onChange={(e) => setImage(e.target.value)}
         onKeyDown={(e) => {
          if(e.key === "Enter") {
            editId ? updateFood() : addFood();
          }
         }}
         placeholder='Enter image URL'
       />

        <button onClick={editId ? updateFood : addFood}>
              {editId ? "Update Food" : "Add Food"}
        </button>

        <div className='category-filter'>

          <button onClick={() => setSelectedCategory("All")}>
                All
          </button>

          <button onClick={() => setSelectedCategory("Fast Food")}>
                Fast Food
          </button>

          <button onClick={() => setSelectedCategory("Chinese")}>
                Chinese
          </button>

          <button onClick={() => setSelectedCategory("Desert")}>
                Desert
          </button>
        </div>

        <h3>Selected: {selectedCategory}</h3>
        <h2>Cart items: {cart.length}</h2>
        <h2>Total Price:Rs. {totalPrice}</h2>

        <div className='cart-container'>
          {cart.map((item) => (
            <div key={item._id} className='cart-item'>
              <h3>{item.name}</h3>
              <p>Rs. {item.price}</p>
              <p>Qty: {item.quantity}</p>
              <p>Subtotal: Rs.{item.price * item.quantity}</p>

              <button onClick={() => removeFromCart(item._id)}>
                  Remove
              </button>
             </div> 
          ))}

        </div>

        <div className='food-container'>
           {
        filteredFoods.map((food) => (
          <div 
          key={food._id} 
          className='food-card'
          >

            <img src={food.image} />

            <h2>{food.name}</h2>
            <p>Rs.{food.price}</p>

            <button onClick={() => handleEdit(food)}>Edit</button>

            <button onClick={() => deletefood(food._id)}>Delete</button>

            <button onClick={() => addToCart(food)}>Add To Cart</button>

            <button onClick={() => setSelectedFood(food)}>View Details</button>

          </div>

          
        ))
      }
    </div>
    {
      selectedFood && (
        <div className='modal-overlay'>
          <div className='modal-box'>
            <h2>{selectedFood.name}</h2>
         <p>Price: Rs. {selectedFood.price}</p>
         <p>category: {selectedFood.category}</p>
         <p>description: {selectedFood.description}</p>

         <button onClick={() => setSelectedFood(null)}>
             Close
         </button>
          </div>
         

        </div>
      )
    }
        </div>

      
  )
}

export default App;
