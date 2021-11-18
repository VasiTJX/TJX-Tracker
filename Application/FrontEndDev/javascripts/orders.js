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

