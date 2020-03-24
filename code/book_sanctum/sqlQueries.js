
const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function deleteData(){

    pool.query('delete from book; delete from author; delete from genre; delete from publisher;',
    (err, result) => {
    if (err) {
      return console.error('Error executing query', err.stack)
    }
    //console.log(result.rows) // brianc
  })
}
function sqlQueries(){
  this.checkoutOrder = function(username, date, res){
    console.log("date is "+ date + " user is " + username);

    pool.query("insert into orders values(default, $1, $2)",
               [username, date], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    })
  }
  this.getOrders = function(username, res){
    pool.query("select orders.order_date, book.isbn, book.title, author.name, book.price, order_book.quantity, order_book.order_number "+
              "from order_book "+
              "inner join orders on orders.order_number = order_book.order_number "+
              "inner join book on order_book.isbn = book.isbn "+
              "inner join author on book.author_id = author.id "+
              "where orders.username = $1 " +
              "order by order_book.order_number desc;",
              [username], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    });
  }

  this.signup = function (username, password, email, fname, lname, res){
    console.log("username = "+ username);
    console.log("password = " + password);

    return new Promise (function(resolve, reject){
        pool.query("insert into client values ($1, $2, $3, $4, $5);",
                 [username, email, fname, lname, password], (err, result) => {
        if (err) {
        resolve("");
        }
        else{
        //res.json(JSON.stringify(result.rows));
        resolve(username);
      }

      })
    });

  }

  this.login = function (username, password, res){
    console.log("username = "+ username);
    console.log("password = " + password);

    return new Promise (function(resolve, reject){
        pool.query("select username from client "+
                 "where (LOWER(username) = LOWER($1) "+
                 "or LOWER(email) = LOWER($1) ) "+
                 "AND password = $2;",
                 [username, password], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        console.log(result.rows) // brianc
        //res.json(JSON.stringify(result.rows));
        if(result.rows.length==0){
          resolve('');
        }
        else{
          resolve(result.rows[0]["username"]);
        }
      })
    });

  }
  this.addtoCart = function(username, isbn, quantity,res){
    console.log("username "+ username);
    console.log("isbn "+ isbn);
    console.log("quantity "+ quantity);

    pool.query("insert into cart values($1, $2, $3) "+
               "on conflict (username, isbn) do update "+
               "set quantity = $3 "+
               "where $1 = cart.username and $2 = cart.isbn;",
               [username, isbn, quantity], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    })
  }

  this.getCartList = function(username, res){
    pool.query("select book.isbn,book.title,book.price,cart.quantity from book "+
               "inner join cart on book.isbn = cart.isbn "+
               "where cart.username = $1;",
               [username], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    })
  }

  this.searchBooksByTitle = function(title, res){
    console.log(title);
    title = `%${title}%`;
    pool.query("select book.isbn,book.title,book.price,author.name as author "+
              "from book inner join author on author.id = book.author_id "+
               "where title ILIKE $1;",
               [title], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    })
  }

  this.filterBooksByGenre = function(title, res){
    console.log(title);
    title = `%${title}%`;
    pool.query("select name, count(*) "+
               "from (select * from book "+
               "where title ILIKE $1) as search "+
               "inner join genre on search.genre_id = genre.id "+
               "group by (name);",
               [title], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    })
  }

  this.filterBooksByAuthor = function(title, res){
    console.log(title);
    title = `%${title}%`;
    pool.query("select name, count(*) "+
               "from (select * from book "+
               "where title ILIKE $1) as search "+
               "inner join author on search.author_id = author.id "+
               "group by (name);",
               [title], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    })
  }

  this.searchBookByISBN = function(isbn, res){

    pool.query("select book.isbn, book.title, book.description, book.price, book.page_count, book.stock, "+
	             "book.rating, book.rating_count, book.published_date, book.add_date, "+
               "author.name as author, genre.name as genre, publisher.name as publisher "+
	             "from book "+
	             "inner join author on book.author_id = author.id "+
	             "inner join genre on book.genre_id = genre.id "+
               "inner join publisher on book.publisher_id = publisher.id "+
               "where book.isbn = $1;",
               [isbn], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows[0]));
    })
  }


  this.getGenres = function(res){

    pool.query("select name "+
              "from genre;",
               [], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    })
  }

  this.getMostRecentBooks = function(limit, res){

    pool.query("select book.isbn, book.title, book.price,author.name "+
               "from book left join author on author.id = book.author_id "+
               "order by book.published_date DESC "+
               "limit $1;",
    [limit], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      //console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    })

  }
}

module.exports = sqlQueries;
