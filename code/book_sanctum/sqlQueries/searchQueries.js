
const { Pool, Client } = require("pg");
const pool = new Pool({
  user: "apqsznwhludbct",
  host: "ec2-35-172-85-250.compute-1.amazonaws.com",
  database: "d66prsg7g28r53",
  password: "161239fa8d874dbc62119103682c4b1e4bd64c313a1535ddcd98f406301a262f",
  port: "5432",
  ssl: true
});

function searchQueries(){


  this.searchBooksByTitle = function(title, genreText, res){
    console.log("search for "+ title + " and " + genreText);
    if(title==''){
      title = null;
    }
    else{
      title = "'"+title+"'";
    }
    genreText = `%${genreText}%`;
    return new Promise (function(resolve, reject){
      pool.query("select book.isbn,book.title,book.price,book.published_date, author.name as author, genre.name as genre_name from book "+
                "inner join author on author.id = book.author_id "+
                "inner join genre on genre.id = book.genre_id "+
                "WHERE genre.name like $2 "+
                `and (${title} is null or (similarity(book.title,$1) > 0.15 or similarity(author.name,$1) > 0.3) );`,
                 [title,genreText], (err, result) => {
        if (err) {
          return console.error('Error executing query', err.stack)
        }
        resolve(result.rows);
      })
    });
  }

  this.filterBooksByGenre = function(title, genreText, res){
    console.log(title +", "+genreText);
    if(title==''){
      title = null;
    }
    else{
      title = "'"+title+"'";
    }
    genreText = `%${genreText}%`;
    /*
    pool.query(
              //"select search.name, count(*) from ( "+
              "select genre.name as name from book "+
              "inner join author on author.id = book.author_id "+
              "inner join genre on genre.id = book.genre_id "+
              "WHERE genre.name like $2 "+
              `and (${title} is null or (similarity(book.title,$1) > 0.15 or similarity(author.name, $1) > 0.3) ); `+
              //") as search "+
              //"group by ( search.name) "
              //+";",
               [title, genreText], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }
      console.log(result.rows) // brianc
      res.json(JSON.stringify(result.rows));
    })*/
  }

  this.filterBooksByAuthor = function(title, genreText, res){
    console.log(title);
    if(title==''){
      title = null;
    }
    else{
      title = "'"+title+"'";
    }
    /*
    genreText = `%${genreText}%`;
    pool.query("select search.name, count(*) from ("+
              "select author.name as name from book "+
              "inner join author on author.id = book.author_id "+
              "inner join genre on genre.id = book.genre_id "+
              "WHERE genre.name like $2 "+
              `and (${title} is null or (similarity(book.title,$1) > 0.15 or similarity(author.name,$1) > 0.3) )` +
               ") as search "+
               "group by ( search.name);",
               [title, genreText], (err, result) => {
      if (err) {
        return console.error('Error executing query', err.stack)
      }

      res.json(JSON.stringify(result.rows));
    })*/
  }

}

module.exports = searchQueries;