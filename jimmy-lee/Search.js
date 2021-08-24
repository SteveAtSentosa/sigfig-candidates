import React from 'react';
import _keys from 'lodash/keys';
import { useSelector, useDispatch } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { getCustomUrlSearchParams } from 'global';
import {
  GenreList,
  ListHeader,
  TabList,
  GridListSearch as GridList,
  TablePagination,
  LoadingSpinner,
} from 'components';

import {
  getSearchResults,
  fetchMovieGenreList,
  fetchShowGenreList,
  // fetchFreeNetworkList,
  getRadioStations,
  fetchRelated,
} from 'apis';
import { setSearch } from 'redux/reducers/search';
import { MetaTagComponent } from '../../components/MetaTagComponent';

export const SearchPage = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const location = useLocation();
  const { q: search } = getCustomUrlSearchParams(location.search);
  const [currentPage, setCurrentPage] = React.useState(1);
  const [tabIndex, setTabIndex] = React.useState(0);

  const [
    searchResultByType,
    searchResult,
    relatedShows,
    relatedMovies,
    lastSearchTerm,
    movieGenreList,
    showGenreList,
    isRequestLoading,
    // freeNetworksList,
    radioStationsList,
  ] = useSelector(({ genres, loading, networks, music, ...state }) => [
    state.search.resultByType,
    state.search.result,
    state.search.relatedShows,
    state.search.relatedMovies,
    state.search.lastSearch,
    genres.show,
    genres.movie,
    loading.isLoading,
    networks.freeNetworks,
    music.radioStations,
  ]);

  const hasResults = React.useMemo(
    () =>
      searchResult &&
      !!searchResult[tabIndex]?.count &&
      !!searchResult[tabIndex]?.type,
    [searchResultByType, searchResult, tabIndex],
  );

  const hasResultsOnCurrentTab = React.useMemo(
    () => hasResults && !!searchResultByType?.length && !isRequestLoading,
    [hasResults, searchResultByType, isRequestLoading],
  );

  const hasRelatedShowsResults = React.useMemo(
    () =>
      relatedShows &&
      !!relatedShows.length &&
      hasResultsOnCurrentTab &&
      searchResult[tabIndex]?.type === 'shows',
    [tabIndex, searchResult, hasResultsOnCurrentTab, relatedShows],
  );

  const hasRelatedMoviesResults = React.useMemo(
    () =>
      relatedMovies &&
      !!relatedMovies.length &&
      hasResultsOnCurrentTab &&
      searchResult[tabIndex]?.type === 'movies',
    [tabIndex, searchResult, hasResultsOnCurrentTab, relatedMovies],
  );

  const isMusicTheCurrentTab = React.useMemo(
    () => hasResultsOnCurrentTab && searchResult[tabIndex]?.type === 'music',
    [hasResultsOnCurrentTab, searchResult, tabIndex],
  );

  const shouldRenderRadioStationsOnTheMusicTab = React.useMemo(
    () => isMusicTheCurrentTab && !!radioStationsList?.length,
    [isMusicTheCurrentTab, radioStationsList],
  );

  const onChangeTab = React.useCallback(
    (index) => {
      setCurrentPage(1);
      setTabIndex(index);
    },
    [setCurrentPage, setTabIndex],
  );

  /**
   * fetch show and movie genres lists
   */
  React.useEffect(() => {
    const actions = {
      show: { count: showGenreList.length, action: fetchShowGenreList },
      movie: { count: movieGenreList.length, action: fetchMovieGenreList },
    };

    _keys(actions).forEach(
      (key) => !actions[key].count && dispatch(actions[key].action()),
    );
  }, []); // eslint-disable-line

  React.useEffect(() => {
    const params = {
      ...getCustomUrlSearchParams(location.search),
    };

    if (params.q === lastSearchTerm) {
      return;
    }

    setTabIndex(0);
    setCurrentPage(1);

    dispatch(setSearch({ field: 'lastSearch', value: params.q }));
    dispatch(setSearch({ field: 'relatedShows', value: undefined }));
    dispatch(setSearch({ field: 'relatedMovies', value: undefined }));
    dispatch(getSearchResults(params));
  }, [location.search, dispatch]); // eslint-disable-line

  const onChangeCurrentPage = (type, searchQ) => {
    dispatch(fetchRelated(type, searchQ));
  };

  React.useEffect(() => {
    const params = {
      ...getCustomUrlSearchParams(location.search),
    };

    searchResult.forEach((result) => {
      if (
        (result.type === 'shows' && !relatedShows) ||
        (result.type === 'movies' && !relatedMovies)
      ) {
        onChangeCurrentPage(result.type, params.q);
      }
    });
  }, [searchResult]);

  React.useEffect(() => {
    if (searchResult[tabIndex]?.type !== 'music') {
      return;
    }

    dispatch(
      getRadioStations({
        params: { search: location.search, page: currentPage },
      }),
    );
  }, [location.search, tabIndex, currentPage]); // eslint-disable-line

  return (
    <>
      <MetaTagComponent title="Search Result" />
      <Box className={classes.container}>
        <ListHeader
          mt={-1}
          mb={-0.5}
          title={`Search Results For "${search}"`}
        />
        {!hasResults && !isRequestLoading && (
          <Box p="40px 0px">
            <Box className={classes.noResultsTitleBox} mb={2}>
              {`No results found for: "${search}"`}
            </Box>
            {!!showGenreList?.length && (
              <GenreList
                genres={showGenreList}
                title="TV Show Genres"
                type="shows"
              />
            )}
            {!!movieGenreList?.length && (
              <GenreList
                genres={movieGenreList}
                title="Movie Genres"
                type="movies"
              />
            )}
            {/* TODO: Display this section only when there's an endpoint that returns the free networks */}
            {/* {!!freeNetworksList?.length && (
              <FreeNetworksList
                freeNetworks={freeNetworksList}
                className={classes.freeNetworks}
              />
            )} */}
          </Box>
        )}

        {(hasResults || isRequestLoading) && (
          <Box pt={2}>
            <Box display="flex" className={classes.tableHeaderContainer}>
              <TabList
                searchResult={searchResult}
                onChangeTab={onChangeTab}
                tabIndex={tabIndex}
              />
              <Box className={classes.paginationContainer}>
                <TablePagination
                  totalItems={searchResult[tabIndex]?.count}
                  currentPage={currentPage}
                  setCurrentPage={setCurrentPage}
                  type={searchResult[tabIndex]?.type}
                />
              </Box>
            </Box>
            {isRequestLoading && (
              <Box
                width={1}
                justifyContent="center"
                alignItems="center"
                height="40vh"
                position="relative"
              >
                <LoadingSpinner />
              </Box>
            )}
            {hasResultsOnCurrentTab && searchResult[tabIndex]?.type && (
              <Box p="16px 0px">
                <GridList
                  isMusicTheCurrentTab={isMusicTheCurrentTab}
                  items={searchResult[tabIndex]?.items}
                  type={searchResult[tabIndex]?.type}
                  title={searchResult[tabIndex]?.title}
                />
              </Box>
            )}
            {hasRelatedShowsResults && searchResult[tabIndex]?.type && (
              <Box p="16px 0px">
                <Box
                  paddingTop="10px"
                  borderTop="1px solid #424242"
                  className={classes.titleBox}
                  mb={2}
                >
                  <Box>You may also like</Box>
                </Box>
                <GridList
                  items={relatedShows}
                  type={searchResult[tabIndex]?.type}
                />
              </Box>
            )}
            {hasRelatedMoviesResults && searchResult[tabIndex]?.type && (
              <Box p="16px 0px">
                <Box
                  paddingTop="10px"
                  borderTop="1px solid #424242"
                  className={classes.titleBox}
                  mb={2}
                >
                  <Box>You may also like</Box>
                </Box>
                <GridList
                  items={relatedMovies}
                  type={searchResult[tabIndex]?.type}
                />
              </Box>
            )}
            {shouldRenderRadioStationsOnTheMusicTab && (
              <Box p="16px 0px">
                <GridList
                  isMusicTheCurrentTab={isMusicTheCurrentTab}
                  items={radioStationsList}
                  type="radio"
                  title="Radio Stations"
                />
              </Box>
            )}
          </Box>
        )}
      </Box>
    </>
  );
};

const useStyles = makeStyles((theme) => ({
  container: {
    padding: `${theme.spacing(6)}px ${theme.spacing(6)}px`,
    color: 'white',
  },
  titleBox: {
    display: 'flex',
    fontSize: theme.typography.h5.fontSize,
  },
  noResultsTitleBox: {
    display: 'flex',
    justifyContent: 'center',
    fontSize: theme.typography.h4.fontSize,
  },
  tableHeaderContainer: {
    [theme.breakpoints.down('sm')]: {
      flexDirection: 'column',
    },
  },
  paginationContainer: {
    display: 'flex',
    flexGrow: 1,
    justifyContent: 'flex-end',
    [theme.breakpoints.down('sm')]: {
      justifyContent: 'center',
    },
  },
}));
