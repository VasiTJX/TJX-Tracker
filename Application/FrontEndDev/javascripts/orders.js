let url = "http://tjx-tracker.azurewebsites.net/api/orders";

axios.get(url).then(({data}) => {
    let orderData = generateOrders(data);
    console.log(data);
    document.getElementById("tableBody").replaceChildren(...orderData);
})

function generateOrders(orders){
    let orderTable = orders.map((order) => {
        let row = document.createElement("tr");
        let time = document.getElementById("time").value;
        row.insertAdjacentHTML(
      "beforeend",
      `
      <td>${order.order_id}</td>
      <td>${order.order_notes}</td>
      <td>${time}</td>
      <td>${order.order_detail}</td>
      `
    ); return row;
    }); return orderTable;
}

