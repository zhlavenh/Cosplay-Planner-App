function CreateNewCard(){

    function goTo(){
        window.location.href = "/create/new-collection";
    }    
    return(
        <React.Fragment>
            <div className="col card-box m-3 create-new" onClick={goTo} style={{padding: 'auto 12px'}}>

                <div className="d-flex align-items-center justify-content-center" >
                    <div className="btn d-flex flex-column align-items-center justify-content-center" style={{width: '50%', height: '50%'}} >
                        <h5 style={{color: "white", textDecoration: "none"}}>Create a new collection</h5>
                        <i className="bi bi-plus-circle" style={{fontSize: '60px', color: "white"}}></i>
                    </div>   
                </div>

            </div>
        </React.Fragment>
    );
}

function CollectionCard(props){
    function goToIndCol(evt){
        
        window.location = `/my-collections/${encodeURIComponent(evt.target.innerText)}`
    }

    return (
    <div className="col card-box m-3 p-3">
        <div className="d-flex justify-content-around m-2">
            <span onClick={goToIndCol} className="card-box ind-col p-1" data-bs-toggle="tooltip" data-bs-placement="top" title="Click to open collection">{props.collection_name}</span>
            <h6>Collection Last Updated: {props.collection_LUPD}</h6>
        </div>
        <div className="row d-flex justify-content-evenly" style={{height: "100px"}}>
            <div className="d-flex flex-column col-5 card-box m-1" >
                <span>Characters in collection: </span>
                {props.collection_characters}
            </div>
            <div className="d-flex flex-column col-5 card-box m-1">
                <span>Outifts in collection: </span>
                {props.collection_outfits}
            </div>
        </div>

       

    </div>
    );
}

function UserCollections(){
    const [listOfCol, setListOfCol] = React.useState()

    function goToPage(evt){
        window.location = evt.target.id
    }

    function displayCols(){
        let content = []
        for (let index in listOfCol){
            let collection_name = listOfCol[index][0]
            let collection_LUPD = listOfCol[index][1]
            let collection_characters = []
            let collection_outfits =[]
            for (let char_out in listOfCol[index]){
                collection_characters.push(<span onClick={goToPage} id={`/characters/${listOfCol[index][2][char_out]}`} className="line-sp">{listOfCol[index][2][char_out]}</span>)
                collection_outfits.push(<span onClick={goToPage} id={`/my-outfits/${encodeURIComponent(listOfCol[index][3][char_out])}`} className="line-sp">{listOfCol[index][3][char_out]}</span>)
            }


            content.push(
                <CollectionCard collection_name={collection_name} collection_LUPD={collection_LUPD} 
                collection_characters={collection_characters} collection_outfits={collection_outfits}/>
            );

        }
        return content
    }

    React.useEffect(() => {
        fetch('/user_creations')
        .then((response)=>response.json())
        .then((serverData)=>{
            setListOfCol(serverData.collections_info);
        });
    }, []);




    return (
        <div className="vh-100">
            
            <div className="d-flex header-div justify-content-between">
                <div className="d-flex flex-column justify-content-center">
                    <h1 className="align-self-center">Welcome to your collections page</h1>
                    <p>
                        Click on a character, collection, or outfit name to go to their page.
                    </p>
                </div>

                <CreateNewCard />
            </div>
            <div className="d-flex flex-column overflow-auto h-50" data-bs-toggle="tooltip" 
            data-bs-placement="top" title="Scroll to see more collections">
                {displayCols()}
            </div>
            <div className="d-flex">
                <CreateNewCard />
            </div>
        </div>

    );
}

function Collection(){
    const current_collection = {name: decodeURIComponent(window.location.pathname).slice(16)};
    const [collection_info, setCollectionInfo] = React.useState({});

    React.useEffect(() => {
        fetch('/get_collection_info', {
            method: "POST",
            body: JSON.stringify(current_collection),
            headers: {'Content-Type': 'application/json',},
        })
        .then((response) => response.json())
        .then((responseJson) => {
            setCollectionInfo(responseJson);
        })
    }, []);

    function goToCOl(evt){
        window.location = evt.target.id;
    }

    function characterInCol(){
        const lst = []
        for (let index in collection_info.char_list){
            let cur_char = collection_info.char_list[index]
            lst.push(
                <img onClick={goToCOl} className="m-2 box-photo" data-bs-toggle="tooltip" data-bs-placement="top" title="Click to go to character page" id={`/characters/${encodeURIComponent(cur_char["char_name"])}`} src={cur_char["char_img"]}/>
            );
        }
        return lst
    }

    function outfitInCol(){
        const lst = []
        for (let index in collection_info.outfit_list){
            let curr_out = collection_info.outfit_list[index]
            lst.push(
                <div onClick={goToCOl} id={`/my-outfits/${encodeURIComponent(curr_out)}`} className="border-top border-bottom border-secondary d-flex justify-content-center" data-bs-toggle="tooltip" data-bs-placement="top" title="Click to go to outfit page" style={{cursor: "pointer"}}>{curr_out}</div>
            );
        }
        return lst
    }

    return(
        <div className="vh-100">
            <h3 className="align-self-center m-1">{collection_info.collection_name}</h3>
            <div className="d-flex flex-column">
                <span className="box-heads">Characters in collection: </span>
                <div className="boxes d-flex align-items-center">
                    {characterInCol()}
                </div>
            </div><br/>
            <div className="d-flex flex-column">
                <span className="box-heads">Outfits in collection: </span>
                <div className="boxes p-0 overflow-auto" >
                    {outfitInCol()}
                </div>
            </div>
        </div>
    );
}
// Page Renders
const currentURL = window.location.pathname;
if (currentURL === "/my-collections"){
    ReactDOM.render(<UserCollections />, document.getElementById("user_collections"));
}
else if (currentURL.startsWith("/my-collections/")){
    ReactDOM.render(<Collection />, document.getElementById("collection"));
}

