/** Given a query string, return array of matching shows:
 *     { id, name, summary, episodesUrl }
 */


/** Search Shows
 *    - given a search term, search for tv shows that
 *      match that query.  The function is async show it
 *       will be returning a promise.
 *
 *   - Returns an array of objects. Each object should include
 *     following show information:
 *    {
        id: <show id>,
        name: <show name>,
        summary: <show summary>,
        image: <an image from the show data, or a default image if no image exists, (image isn't needed until later)>
      }
 */
async function searchShows(query) {
  const response = await axios.get(`http://api.tvmaze.com/search/shows?q=${query}`);
  const defaultImgUrl = 'https://tinyurl.com/tv-missing';
  const showResults = response.data;
  
  let showArray = showResults.map((item) => {
    let show = item.show;
    return {
      id: show.id,
      name: show.name,
      summary: show.summary,
      image: show.image ? show.image.original : defaultImgUrl
    }
  })

  return showArray;
}

/** Populate shows list:
 *     - given list of shows, add shows to DOM
 */
function populateShows(shows) {
  const $showsList = $("#shows-list");
  $showsList.empty();

  for (let show of shows) {
    let $item = $(
      `<div class="col-md-6 col-lg-3 Show" data-show-id="${show.id}">
         <div class="card" data-show-id="${show.id}">
           <img class="card-img-top" src="${show.image}">
           <div class="card-body">
             <h5 class="card-title">${show.name}</h5>
             <p class="card-text">${show.summary}</p>
             <button class="btn btn-primary" id="showEpisodes">Episodes</button>            
           </div>
         </div>
       </div>
      `);
    $showsList.append($item);
  }
}

/** Populate episodes list:
 *     - accepts an array of episode data objects, adds list of episodes to the DOM
 *     - format: Pilot (Season 1, Number 1)
 */
 function populateEpisodes(episodes) {
  const $episodesList = $("#episodes-list");
  $episodesList.empty();
  $('#episodes-area').show();

  for (let episode of episodes) {
    let $listItem = $(
      `<li>${episode.name} (Season ${episode.season}, Number ${episode.number})</li>`);

    $episodesList.append($listItem);
  }
}

/** Handle search form submission:
 *    - hide episodes area
 *    - get list of matching shows and show in shows list
 */
$("#search-form").on("submit", async function handleSearch (evt) {
  evt.preventDefault();

  let query = $("#search-query").val();
  if (!query) return;

  $("#episodes-area").hide();

  let shows = await searchShows(query);

  populateShows(shows);
});

/** Get div id from DOM to call getEpisodes */
$('#shows-list').on('click', '#showEpisodes', function (e) {
  e.preventDefault();
  const targetId = $(e.target).closest('.Show').data('showId');
  getEpisodes(targetId);
})

/** Given a show ID, return list of episodes:
 *      { id, name, season, number }
 */
async function getEpisodes(id) {
  const response = await axios.get(`http://api.tvmaze.com/shows/${id}/episodes`);
  let episodesData = response.data.map((item) => {
    return {id: item.id, 
            name: item.name, 
            season: item.season, 
            number: item.number}
  })

  populateEpisodes(episodesData);
}
