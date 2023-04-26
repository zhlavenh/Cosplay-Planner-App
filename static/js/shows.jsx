

function ShowCard(props){
    function goToShow(){
        window.location = `/shows/${props.show_title}`
    }


    return(
        <div className="d-flex flex-column border border-secondary rounded m-3 p-2" style={{width: "13rem", height: "300px"}}>
            <div className="d-flex justify-content-center">
                <img className="card-img-top" src={props.show_img} alt="show_title" style={{width: "8rem", height: "115px"}}/>
            </div>
            <div className="d-flex flex-column align-self-center mt-1">
                <h5 className="card-title" style={{fontSize: "15px"}}>{props.show_title}</h5>
                <a onClick={goToShow} className="btn btn-primary" style={{fontSize: "15px"}}>{props.show_title}</a>
            </div>
        </div>
    );
}


function AllShows(){
    const [currentPage, setCurrentPage] = React.useState({page: 1});
    const [shows, setShows] = React.useState([])


    function changePage(evt){
        evt.preventDefault();
        const toDo = evt.target.id;
        if (toDo == "previousPage" && currentPage != 1){
            setCurrentPage({...currentPage, page: currentPage["page"] - 1});
        }
        else if (toDo == "nextPage"){
            setCurrentPage({...currentPage, page: currentPage["page"] + 1});
        }
    }

    React.useEffect(() => {
        fetch('/disp_all_anime',{
            method: 'POST',
            body: JSON.stringify(currentPage),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        .then((response)=>response.json())
        .then((severData)=>{
            setShows(severData["media"]);
        });
    }, [currentPage]);

    function displayAnime(){
        let content = []
        for (let index in shows) {

            const show_img = shows[index]["coverImage"]["medium"]
            const japanese_title = shows[index]["title"]["native"];
            let show_title = shows[index]["title"]["english"];

            if (show_title == null){
                show_title = shows[index]["title"]["native"];
            }

            content.push(<ShowCard show_img={show_img} show_title={show_title}/>);
        }

        return content;
    }



    return (
        <div className="container">
            <h1>This is a page for all shows</h1>

            <div className="d-flex justify-content-between flex-wrap">
                {displayAnime()}
            </div><br/>
            <div className="d-flex justify-content-between">
                <button id="previousPage" onClick={changePage}>Go to previous page</button>
                <button id="nextPage" onClick={changePage}>Go to next page</button>
            </div>

        </div>

    );
}

function IndShow(){
    const show_title = {showName: decodeURI(window.location.pathname).slice(7)};

    const [showInfo, setShowInfo] = React.useState({});
    const [characters, setCharacters] = React.useState({});

    React.useEffect(() => {
        fetch("/find_show", {
            method: "POST",
            body: JSON.stringify(show_title),
            headers: {'Content-Type': 'application/json',},
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            setShowInfo(responseJSON.show_info);
            setCharacters(responseJSON["characters_in_show"])
        });
    }, []);

    function goToChar(evt){
        if (!evt.target.id){
            window.location = evt.target.parentElement.id;
        } else {window.location = evt.target.id;}
    }

    function character_row(){
        const list_of_character_info = [];

        for (let index in characters){
            const curr_char = characters[index];
            const eng_name = curr_char.character_eng_name
            let page_id = eng_name
            if (eng_name){
                page_id = `/characters/${eng_name}`;
            } else {page_id = "";}

            list_of_character_info.push(
            <div onClick={goToChar} className="d-flex p-1  border-bottom border-top" id={page_id}>
                <img src={curr_char.character_img} style={{height: "40px", width: "40px"}}/>
                <div className="px-2"><span>English name:</span>{eng_name}</div>
                <div><span>Native name:</span>{curr_char.character_native_name}</div>
            </div>
                );
        }

        return list_of_character_info
    }

    return(
        <div className="container">
            <div className="d-flex ">
                <div className="p-2">
                    <img src={showInfo.show_img} style={{height: "300px"}}/>
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <span>English title:</span>
                    <h2>{showInfo.show_eng_title}</h2><br/>
                    <span>Native Title:</span>
                    <h2>{showInfo.show_native_title}</h2>
                </div>
            </div>
            <div className="d-flex flex-column">
                <div className="d-flex justify-content-around">
                    <div><span>Started: </span>{showInfo.start_date}</div>
                    <div><span>Ended: </span>{showInfo.end_date}</div>
                    <div><span>Episodes: </span>{showInfo.num_episodes}</div>
                </div>
                <div className="d-flex flex-column">
                    <div>Description: </div>
                    <div className="border border-secondary rounded overflow-auto" style={{height: "100px"}}>
                        {showInfo.show_description}
                    </div>
                </div><br/>
                <div className="d-flex flex-column">
                    <div>Characters:</div>
                    <div className="border border-secondary rounded overflow-auto" style={{height: "300px"}}>
                        {character_row()}
                    </div>
                </div><br/>
            </div>
        </div>
    );
}


// Page Renders
const currentURL = window.location.pathname;
if (currentURL === "/shows"){
    ReactDOM.render(<AllShows />, document.getElementById("shows"));
}
else if (currentURL.startsWith("/shows/")){
    ReactDOM.render(<IndShow />, document.getElementById("ind_show"));
}
