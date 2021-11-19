let url = "http://tjx-tracker.azurewebsites.net/api/orders";
let orderTable = undefined

$(document).ready(function () {
    let table = $("#ordersTable").DataTable({
      "ordering": false,
      "searching":false
    });
  
    axios.get(url).then(({ data }) => {
        generateOrders(data, table);
      table.draw();
    });
    orderTable = table;

    // When clicking on the table launch the modal 
    $("#ordersTable").on("click" , (e) => {
        console.log("clicked");
        var myModal = new bootstrap.Modal(document.getElementById('orderTableModal'), {
            keyboard: false
          })
        myModal.show();
        console.log($(e.target)
        .closest("tr")
        .children().html())
    })
  });

function generateOrders(orders , table){
    let orderTable = orders.map((order) => {
       let orderID = order.order_id;
       let orderNotes = order.order_notes;
       let productsQuantity = "";
       let date = new Date(order.datetime_order_placed);
       let customerID = order.customer_detail.customer_id;
       let customerFirstName = order.customer_detail.first_name;
       let customerLastName = order.customer_detail.last_name;
       let status = order.status_desc;
    //    order.order_detail.map((detail) => {
    //     if (productsQuantity){
    //         productsQuantity += "," + detail.product_id + ":" + detail.quantity_purchased ;
    //     }
    //     else {
    //         productsQuantity += detail.product_id + ":" + detail.quantity_purchased ;
    //     }
    //    });
       table.row.add([
        orderID,
        orderNotes,
        date.toDateString(),
        customerID,
        customerFirstName,
        customerLastName,
        status,
      ]);
    });
}

document.getElementById("search-order-button").addEventListener("click", async(evt) => {
    evt.preventDefault();
    let search_cat = document.querySelector("#dropdownMenuButton1").value;
	let search_attr = document.querySelector("#productSearch").value;

    switch (search_cat) {
		case "Product ID":
			search_cat = "product_id";
			break;
		case "SKU Number":
			search_cat = "product_sku";
			break;
		case "Product Name":
			search_cat = "product_name";
			break;
	}

	if (search_cat === "product_id"){
		let newproductSearch = [];
		await axios.get("http://tjx-tracker.azurewebsites.net/api/products").then(({data}) => {
			data.forEach(element => {
				if (element[search_cat] == search_attr){
					newproductSearch.push(element);	
				}
			});
			let removal = document.getElementById("catalogue");
			while (removal.firstChild){
				removal.removeChild(removal.firstChild);
			}
			generateProducts(newproductSearch);
		}); 	
	} 
});


function generateProducts(products){

	let picture = products.map((product) => {
		let zone = document.createElement("div");
		zone.classList.add("box", "zone");
		zone.setAttribute("id", `${product.product_id}`);
		document.getElementById("catalogue").appendChild(zone);
		let name = document.createElement("h5");
		name.innerHTML = `<strong>${product.product_name}</strong>`;
		let img = document.createElement("img");
		img.src = `${product.image_url}`;
		document.getElementById(`${product.product_id}`).appendChild(img);
		document.getElementById(`${product.product_id}`).appendChild(name);
        let newZone = document.createElement("div");
        newZone.setAttribute("id", "orderZone");
        document.getElementById("catalogue").appendChild(newZone);
        let options = document.createElement("label");
        options.innerText = "Quantity";
        document.getElementById("orderZone").appendChild(options);
        let selection = document.createElement("select");
        selection.classList.add("form-select");
        selection.setAttribute("id", "orderA");
        selection.innerHTML = `<option selected>Choose an amount</option>`;
        document.getElementById("orderZone").appendChild(selection);
        let contents = "";
        let productQ = product.product_quantity;
        for (var i=0; i<=productQ; i++) {
            contents += `<option> ${i} </option>`;
        }
        document.getElementById("orderA").innerHTML = contents;

    });
 return picture;
}



function dropdownmenuSet(val){
	if(val.innerHTML!=""){
		$('#dropdownMenuButton1').val(val.innerHTML);
		$('#dropdownMenuButton1').html(val.innerHTML);
	} else {
		$('#dropdownMenuButton1').val('');
		$('#dropdownMenuButton1').html('Search using:');
	}
}