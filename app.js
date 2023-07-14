const express = require("express");
const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const path = require("path");
console.log(path);
const databasePath = path.join(__dirname, "moviesData.db");
console.log(databasePath);
const app = express();

// app.use(express.json());

let database = null;

const initializeDbAndServer = async () => {
  try {
    database = await open({
      filename: databasePath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("server running at http://localhost:3000/");
    });
  } catch (error) {
    console.log(`Db Error: ${error.message}`);
    process.exit(1);
  }
};

initializeDbAndServer();

const convertDbObjectToResponseObject = (dbObject) => {
  return {
    movieId: dbObject.movie_id,
    directorId: dbObject.director_id,
    movieName: dbObject.movie_name,
    leadActor: dbObject.lead_actor,
  };
};

app.get("/movies/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieNamesQuery = `
    SELECT MovieName FROM movie;`;
  const movieArray = await database.get(getMovieNamesQuery);
  response.send(
    movieArray.map((eachMovie) => convertDbObjectToResponseObject(eachMovie))
  );
});

app.post("/movies/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const postMovieDetails = `INSERT INTO movie(directorId,movieName,leadActor)
    VALUES(${DirectorId},'${MovieName}','${LeadActor}');`;
  const movie = await database.run(postMovieDetails);
  response.send("Movie Successfully Added");
});

app.get("/movies/:movieId/", async (request, response) => {
  const { movieId } = request.params;
  const getMovieIdQuery = `SELECT * from movie WHERE movieId=${movieId};`;
  const movie = await database.all(getMovieIdQuery);
  response.send(convertDbObjectToResponseObject(movie));
});

app.put("/movies/:movieId/", async (request, response) => {
  const { directorId, movieName, leadActor } = request.body;
  const { movieId } = request.params;
  const updateMovieDetailsQuery = `UPDATE movie SET director_id=${directorId},movie_name='${movieName}',lead_Actor='${leadActor} WHERE movieId=${movieId};`;
  const movie = await database.run(updateMovieDetailsQuery);
  response.send("Movie Details Updated");
});

app.delete("movies/movieId/", async (request, response) => {
  const { movieId } = request.params;
  const deleteMovieQuery = `DELETE movie WHERE movieId=${movieId};`;
  const movie = await database.run(deleteMovieQuery);
  response.send("Movie Removed");
});

app.get("/directors/", async (request, response) => {
  const { directorId } = request.params;
  const getDirectorDetailsQuery = `SELECT * FROM movie WHERE directorId=${directorId};`;
  const directorArray = await database.run(getDirectorDetailsQuery);
  response.send(
    directorArray.map((eachDirector) =>
      convertDbObjectToResponseObject(eachDirector)
    )
  );
});

app.get("/directors/:directorId/movies/", async (request, response) => {
  const { directorId } = request.params;
  const { movieName } = request.body;
  const getMovieNameQuery = `SELECT * FROM movie WHERE directorId=${directorId};`;
  const movieArray = await database.all(getMovieNameQuery);
  response.send(convertDbObjectToResponseObject(movieArray));
});

module.exports = app;
