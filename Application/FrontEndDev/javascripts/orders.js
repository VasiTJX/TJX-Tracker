let url = "http://tjx-tracker-dev.azurewebsites.net/api/orders";
let orderTable = undefined;

$(document).ready(function () {
  let table = $("#ordersTable").DataTable({
    ordering: false,
    searching: false,
  });

  axios.get(url).then(({ data }) => {
    generateOrders(data, table);
    console.log(data);
    table.draw();
  });
  orderTable = table;

  // When clicking on the table launch the modal
  $("#ordersTable").on("click", (e) => {
    console.log("clicked");
    var myModal = new bootstrap.Modal(
      document.getElementById("orderTableModal"),
      {
        keyboard: false,
      }
    );

    $("#orderTableModal").on("hidden.bs.modal", () => {
      $("#orderTitleModal").text("");
      $("#rowBody").empty();
    });

    let orderId = $(e.target).closest("tr").children().html();

    let newUrl = url + "/" + orderId;
    let oldOrderStatus = null;
    let dataToSend = null;
    axios.get(newUrl).then(({ data }) => {
      console.log(data);
      let orderDetails = data[0];
      dataToSend = orderDetails;
      let customerDetails = orderDetails.customer_detail;
      let productsDetails = orderDetails.order_detail;
      oldOrderStatus = orderDetails.status_desc;
      let title =
        "Order nr." + orderDetails.order_id + ":" + orderDetails.status_desc;
      $("#orderTitleModal").text(title);
      let $div1 = $("<div>", { id: "firstDiv", class: "col-md-4 mb-3" });
      let $h5 = $("<h5>", { text: "Customer details" });
      $div1.append($h5);
      $div1.append(
        `<p><strong>First Name : </strong> ${customerDetails.first_name} </p>`
      );
      if (customerDetails.midlle_name) {
        $div1.append(
          `<p><strong>Midlle Name : </strong> ${customerDetails.midlle_name} </p>`
        );
      } else {
        $div1.append(`<p><strong>Last Name : </strong> </p>`);
      }
      $div1.append(
        `<p><strong>Last Name : </strong> ${customerDetails.last_name} </p>`
      );
      $div1.append(
        `<p class="text-wrap"><strong>Email : </strong> ${customerDetails.email} </p>`
      );
      $div1.append(
        `<p><strong>Phone : </strong> ${customerDetails.phone} </p>`
      );
      $("#rowBody").append($div1);

      let $div2 = $("<div>", { id: "secondDiv", class: "col-md-4 mb-3" });
      $h5 = $("<h5>", { text: "Order details" });
      $div2.append($h5);
      let counter = 1;
      productsDetails.map((product) => {
        $div2.append(`<p><strong>Product nr: ${counter} </p>`);
        $div2.append(
          `<p><strong>Product SKU : </strong> ${product.product_sku} </p>`
        );
        $div2.append(
          `<p><strong>Name : </strong> ${product.product_name} </p>`
        );
        $div2.append(
          `<p><strong>Quantity purchased : </strong> ${product.quantity_purchased} </p>`
        );
        counter += 1;
      });
      $("#rowBody").append($div2);

      let $div3 = $("<div>", { id: "thirdDiv", class: "col-md-4 mb-3" });
      $h5 = $("<h5>", { text: "Additional details" });
      $div3.append($h5);
      let date = new Date(orderDetails.datetime_order_placed);
      $div3.append(
        `<p><strong> Time placed :</strong> ${date.toDateString()} </p>`
      );
      $div3.append(
        `<p><strong> Notes :</strong> ${orderDetails.order_notes} </p>`
      );
      let pStatus = $("<p>", { text: "Status" });
      let select = $("<select>", { class: "form-select", id: "selectId" });
      select.append(`
            <option value="1">Draft</option>
            <option value="2">Open</option>
            <option value="3">Preparing to ship</option>
            <option value="4">Ready for shipping</option>
            <option value="5">Shipped</option>
            <option value="6">Delivered</option>
            <option value="7">Closed</option>`);

      switch (orderDetails.status_desc) {
        case "Draft":
          select.val(1);
          break;
        case "Open":
          select.val(2);
          break;
        case "Preparing to ship":
          select.val(3);
          break;
        case "Ready for shiping":
          select.val(4);
          break;
        case "Shipped":
          select.val(5);
          break;
        case "Delivered":
          select.val(6);
          break;
        case "Closed":
          select.val(7);
          break;
      }
      pStatus.append(select);
      $div3.append(pStatus);

      $("#rowBody").append($div3);
    });
    myModal.show();
    $("#changeOrder").on("click", () => {
      let newVal = $("#selectId").find(":selected").text();
      let newValId = $("#selectId").find(":selected").val();
      console.log("Old is :" + oldOrderStatus + "new is :" + newVal);
      if (oldOrderStatus !== newVal) {
        // Send a put with the change of order
        dataToSend.status_desc = newVal;
        dataToSend.status_id = newValId;
        axios
          .put(newUrl, dataToSend)
          .then((res) => {
            console.log(res);
            myModal.hide();
          })
          .catch((err) => {
            alert("An error occured , please try again!");
            myModal.hide();
          });
      } else {
        // just close the modal
        myModal.hide();
      }
    });
  });
});

function generateOrders(orders, table) {
  let orderTable = orders.map((order) => {
    let orderID = order.order_id;
    let orderNotes = order.order_notes;
    let productsQuantity = "";
    let date = new Date(order.datetime_order_placed);
    let customerID = order.customer_detail.customer_id;
    let customerFirstName = order.customer_detail.first_name;
    let customerLastName = order.customer_detail.last_name;
    let status = order.status_desc;

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

document
  .getElementById("search-order-button")
  .addEventListener("click", async (evt) => {
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

    if (search_cat === "product_id") {
      let newproductSearch = [];
      await axios
        .get("http://tjx-tracker.azurewebsites.net/api/products")
        .then(({ data }) => {
          data.forEach((element) => {
            if (element[search_cat] == search_attr) {
              newproductSearch.push(element);
            }
          });
          let removal = document.getElementById("catalogue");
          while (removal.firstChild) {
            removal.removeChild(removal.firstChild);
          }
          generateProducts(newproductSearch);
        });
    }
  });

function generateProducts(products) {
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
    for (var i = 0; i <= productQ; i++) {
      contents += `<option> ${i} </option>`;
    }
    document.getElementById("orderA").innerHTML = contents;
  });
  return picture;
}


document.getElementById("order-now").addEventListener("click", function() {
        let item = document. createElement("li");
         item.classList.add("list-group-item");
         let quantity = document.getElementById("orderA").value;
         let productID = document.getElementById("productSearch").value;
         item.insertAdjacentHTML('beforeend', `
         <strong>Product ID: ${productID}</strong>
         <strong> Quantity Purchased: ${quantity}</strong>
          `);
          //document.getElementById("order-button").setAttribute("data-bs-dismiss", "modal");
          document.getElementById("listing-order").appendChild(item);
});

  

function dropdownmenuSet(val){
	if(val.innerHTML!=""){
		$('#dropdownMenuButton1').val(val.innerHTML);
		$('#dropdownMenuButton1').html(val.innerHTML);
	} else {
		$('#dropdownMenuButton1').val('');
		$('#dropdownMenuButton1').html('Search using:');
	}
}
