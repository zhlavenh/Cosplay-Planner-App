function CharCard(props){
    function goToCharacter(){
        window.location = `/characters/${props.englishName}`;
    }

    return(
        <div onClick={goToCharacter} className="d-flex flex-column border border-secondary rounded m-1" style={{width: "20rem", height: "350px"}}>
            <div className="d-flex justify-content-between">
                <div className="border-bottom border-end border-secondary" style={{fontSize: "18px"}}>{props.gender}</div>
                <div className="">{props.englishName}</div>
                <div className="border-bottom border-start border-secondary ms-auto">{props.age}</div>
            </div>
            <div className="row justify-content-center ">
                <img src={props.charImg} className="border border-secondary" style={{width: "8rem", height: "115px"}}/>
            </div>
            <div className="d-flex flex-column justify-content-center" style={{fontSize: "13px"}}>
                <span className="d-flex justify-content-center">Desciription:</span>
                <div className="overflow-auto border border-secondary text-break" style={{width: "auto",height: "95px"}}>{props.charDescrip}</div>
                <span className="d-flex justify-content-center">Native Name:</span>
                <span className="d-flex justify-content-center" style={{fontSize: "10px"}}>{props.nativeName}</span>
            </div>
            <div className="row">
                <span>Show title:</span>
                <span className="d-flex justify-content-center" style={{fontSize: "10px"}}>{props.showTitle}</span>
            </div>
        </div>
    );
}

function Characters(){
    const [currentPage, setCurrentPage] = React.useState({page: 1});
    const [characterInfo, setCharacterInfo] = React.useState();

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
        fetch('/disp_all_characters', {
            method: 'POST',
            body: JSON.stringify(currentPage),
            headers: {
                'Content-Type': 'application/json',
            },
        })

        .then((response) => response.json())
        .then((responseJSON) => {            
            setCharacterInfo(responseJSON["characters"]);
        })
    }, [currentPage]);

    function showCharInfo(){
        const cardsInfo = []

        for (let index in characterInfo){
            const character_id = characterInfo[index]["id"]
            const characterEnglishName = characterInfo[index]["name"]["full"];
            const characterNativeName = characterInfo[index]["name"]["native"];
            const characterGenderString = characterInfo[index]["gender"];
            const characterAgeString = characterInfo[index]["age"];
            const characterDescription = characterInfo[index]["description"]
            const showTitleString = characterInfo[index]["media"]["edges"][0]["node"]["title"]
            const characterImage = characterInfo[index]["image"]["medium"]
            let characterGender = null;
            let characterAge = null;
            let showTitle = null;
            if (characterGenderString != null){
                characterGender = characterGenderString[0];
            } else {characterGender = " ";}

            if (characterAgeString != null){
                characterAge = characterAgeString.slice(0,3);
            } else {characterAge = "   ";}

            if (showTitleString["enlgish"] == null){
                showTitle =  showTitleString["native"];
            } else {showTitle = showTitleString["english"];}

            cardsInfo.push(<CharCard char_id={character_id} englishName={characterEnglishName} nativeName={characterNativeName} gender={characterGender} 
                age={characterAge} charDescrip={characterDescription} showTitle={showTitle} charImg={characterImage}/>);
        }

        return cardsInfo
    }

    return (
        <React.Fragment>
        <div className="d-flex justify-content-between flex-wrap">
            {showCharInfo()}
        </div><br/>
        <div className="d-flex justify-content-between">
            <button id="previousPage" onClick={changePage}>Go to previous page</button>
            <button id="nextPage" onClick={changePage}>Go to next page</button>
        </div>
        </React.Fragment>


    );
}

function IndCharacter(){
    const character_name = {name: decodeURI(window.location.pathname).slice(12)};
    const [charInfo, setCharInfo] = React.useState({})

    React.useEffect(() => {
        fetch("/find_single_character", {
            method: "POST",
            body: JSON.stringify(character_name),
            headers: {'Content-Type': 'application/json',},
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            setCharInfo(responseJSON);
        });
    }, []);

    function goToShow(evt){
        if (!evt.target.id){
            window.location = evt.target.parentElement.id;
        } else {window.location = evt.target.id;}
        
    }

    function show_in(){
        const show_list = []
        for (let index in charInfo.appears_in){
            const curr_show = charInfo.appears_in[index];
            const eng_title = curr_show.eng_title
            let page_id = eng_title
            if (eng_title){
                page_id = `/shows/${eng_title}`
            } else {page_id = ""}


            show_list.push(
                <div onClick={goToShow} className="d-flex p-1 border-bottom border-top" id={page_id}>
                    <img src={curr_show.show_img} style={{height: "40px", width: "40px"}}/>
                    <div className="px-2"><span>English name: </span>{eng_title}</div>
                    <div><span>Native name: </span>{curr_show.native_title}</div>
                </div>
            )
        }

        return show_list
    }

    return(
        <div className="container">
            <div className="d-flex">
                <div className="p-2">
                    <img src={charInfo.img} style={{height: "300px"}} />
                </div>
                <div className="d-flex flex-column justify-content-center align-items-center">
                    <span>English name:</span>
                    <h2>{charInfo.eng_name}</h2><br/>
                    <span>Native name</span>
                    <h2>{charInfo.native_name}</h2>
                </div>
            </div>
            <div className="d-flex justify-content-around">
                <div><span>Age: </span>{charInfo.age}</div>
                <div><span>Gender: </span>{charInfo.gender}</div>
            </div><br/>
            <div className="d-flex flex-column">
                <div>Description:</div>
                <div className="border border-secondary rounded overflow-auto" style={{height: "100px"}}>
                    {charInfo.description}
                </div><br/>
                <div>Appears in</div>
                <div className="border border-secondary rounded overflow-auto" style={{height: "200px"}}>
                    {show_in()}
                </div>

            </div>
        </div>
    );
}

// Page Renders
const currentURL = window.location.pathname;
if (currentURL === "/characters"){
    ReactDOM.render(<Characters />, document.getElementById("characters"));
}
else if (currentURL.startsWith("/characters/")){
    ReactDOM.render(<IndCharacter />, document.getElementById("ind_character_page"));
}