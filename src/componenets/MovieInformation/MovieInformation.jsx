import React, { useState } from 'react';
import { Typography, Button, ButtonGroup, Grid, Box, Rating, Modal } from '@mui/material';
import { Movie as MovieIcon, Theaters, Language, PlusOne, Favorite, FavoriteBorderOutlined, Remove, ArrowBack } from '@mui/icons-material';
import { Link, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import genreIcons from '../../assets/genres';
import { selectGenreOrCategory } from '../../features/currentGenreOrCategory';
import { useGetMovieQuery, useGetRecommendationsQuery } from '../../services/TMDB';
import useStyles from './styles';
import { MovieList, LoadingCircle } from '..';

function MovieInformation() {
  const { id } = useParams();
  const { data, isFetching, error } = useGetMovieQuery(id);
  const page = 1;
  const { data: recommendations, isFetching: isRecommendationsFetching } = useGetRecommendationsQuery({ movie_id: id, list: '/recommendations', page });

  const classes = useStyles();
  const dispatch = useDispatch();
  const [open, setOpen] = useState(false);

  console.log(recommendations);

  const [isMovieFavorited, setIsMovieFavorited] = useState(false);
  const [isMovieWatchlisted, setIsMovieWatchlisted] = useState(false);

  const addToFavorites = () => {

  };

  const addToWatchlist = () => {

  };

  if (isFetching || isRecommendationsFetching) {
    return (<LoadingCircle />);
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center">
        <Link to="/">Something has gone wrong. Go back</Link>
      </Box>
    );
  }
  return (
    <>
      <Grid container className={classes.containerSpaceAround}>
        <Grid style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: ' center', marginBottom: '30px' }} item sm={12} lg={4}>
          <img
            className={classes.poster}
            src={`https://image.tmdb.org/t/p/w500/${data?.poster_path}`}
            alt={data?.title}
          />
        </Grid>
        <Grid item container direction="column" lg={7}>
          <Typography variant="h4" align="center" gutterBottom>
            {data?.title} ({data.release_date.split('-')[0]})
          </Typography>
          <Typography variant="h6" align="center" gutterBottom>
            {data?.tagline}
          </Typography>
          <Grid item className={classes.containerSpaceAround}>
            <Box display="flex" align="center">
              <Rating readOnly value={data?.vote_average / 2} />
              <Typography variant="subtitle1" gutterBottom style={{ marginLeft: '10px' }}>
                {data?.vote_average} / 10
              </Typography>
            </Box>
            <Typography variant="h6" gutterBottom align="center">
              {data?.runtime}min | Language: {data?.spoken_languages[0].name}
            </Typography>
          </Grid>
          <Grid item className={classes.genresContainer}>
            {data?.genres?.map((genre, i) => (
              <Link key={genre.name} className={classes.links} to="/" onClick={() => dispatch(selectGenreOrCategory(genre.id))}>
                <img src={genreIcons[genre.name.toLowerCase()]} className={classes.genreImage} height={30} />
                <Typography color="textPrimary" variant="subtitle1">
                  {genre?.name}
                </Typography>
              </Link>
            ))}
          </Grid>
          <Typography variant="h5" gutterBottom style={{ marginTop: '10px' }}>Overview</Typography>
          <Typography style={{ marginBottom: '1rem' }}>{data?.overview}</Typography>
          <Grid item container>
            <div className={classes.buttonsContainer}>
              <Grid style={{ marginTop: '10px' }} item className={classes.buttonsContainer}>
                <ButtonGroup size="small" variant="outlined">
                  <Button target="_blank" rel="noopener noreferrer" href={data?.homepage} endIcon={<Language />}>
                    Website
                  </Button>
                  <Button target="_blank" rel="noopener noreferrer" href={`https://www.imdb.com/title/${data?.imdb_id}`} endIcon={<MovieIcon />}>
                    IMDB
                  </Button>
                  <Button onClick={() => setOpen(true)} href="#" endIcon={<Theaters />}>
                    Trailer
                  </Button>
                </ButtonGroup>
              </Grid>
              <Grid style={{ marginTop: '10px' }} item className={classes.buttonsContainer}>
                <ButtonGroup size="small" variant="outlined">
                  <Button
                    onClick={addToFavorites}
                    endIcon={isMovieFavorited
                      ? <FavoriteBorderOutlined /> : <Favorite />}
                  >
                    {isMovieFavorited ? 'Unfavorite' : 'Favorite'}
                  </Button>
                  <Button
                    onClick={addToWatchlist}
                    endIcon={isMovieWatchlisted
                      ? <Remove /> : <PlusOne />}
                  >
                    Watchlist
                  </Button>
                  <Button sx={{ borderColor: 'primary.main' }} endIcon={<ArrowBack />}>
                    <Typography component={Link} to="/" color="inherit" variant="subtitle2" style={{ textDecoration: 'none' }}>
                      Back
                    </Typography>
                  </Button>
                </ButtonGroup>
              </Grid>
            </div>
          </Grid>
        </Grid>

      </Grid>
      <Typography style={{ marginTop: '10px' }} variant="h4" gutterBottom align="center">Top Cast</Typography>
      <Grid item container spacing={2}>
        {data && data.credits?.cast?.map((character, i) => (
          character.profile_path && (
          <Grid
            key={i}
            item
            xs={4}
            md={2}
            component={Link}
            to={`/actors/${character.id}`}
            style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          >
            <img className={classes.castImage} src={`https://image.tmdb.org/t/p/w500/${character.profile_path}`} alt={character.name} />
            <Typography className={classes.title} color="textPrimary">{character?.name}</Typography>
            <Typography className={classes.title} color="textSecondary">
              {character.character.split('/')[0]}
            </Typography>
          </Grid>
          )
        )).slice(0, 12)}
      </Grid>
      <Box>
        {recommendations?.results?.length
          ? (
            <Grid>
              <Typography style={{ marginTop: '10px' }} variant="h4" gutterBottom align="center">
                You might also like
              </Typography>
              <MovieList movies={recommendations} numberOfMovies={12} />
            </Grid>
          )
          : null}
      </Box>
      <Modal
        closeAfterTransition
        className={classes.modal}
        open={open}
        onClose={() => setOpen(false)}
      >
        {data?.videos?.results?.length > 0 ? (
          <iframe
            autoPlay
            className={classes.video}
            frameBorder="0"
            title="Trailer"
            src={`https://www.youtube.com/embed/${data.videos.results[0].key}`}
            allow="autoplay"
          />
        ) : <>No Video</>}
      </Modal>

    </>
  );
}

export default MovieInformation;
