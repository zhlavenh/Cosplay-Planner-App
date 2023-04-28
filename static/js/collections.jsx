function CreateNewCard(){
    return(
        <React.Fragment>
            <a className="col border border-secondary rounded m-1" role="button" href="/create/new-collection">
                <div className="" style={{padding: 'auto 12px'}}>
                    <div className="d-flex align-items-center justify-content-center" >
                        <div className="btn d-flex align-items-center justify-content-center" style={{width: '50%', height: '50%'}} >
                            <i className="bi bi-plus-circle" style={{fontSize: '60px'}}></i>
                        </div>   
                    </div>
                </div>
            </a>
        </React.Fragment>
    );
}

function CollectionCard(props){
    function goToIndCol(evt){
        
        window.location = `/my-collections/${encodeURIComponent(evt.target.innerText)}`
    }

    return (
    <div className="col border border-secondary rounded m-3">
        <div className="row">
            <div className="col-6">
                <span onClick={goToIndCol}>{props.collection_name}</span>
            </div>
            <div className="col-6">
                {props.collection_LUPD}
            </div>
        </div>
        <div className="row d-flex justify-content-evenly" style={{height: "100px"}}>
            <div className="d-flex flex-column col-5 border border-secondary rounded m-1" >
                {props.collection_characters}
            </div>
            <div className="d-flex flex-column col-5 border border-secondary rounded m-1">
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
                collection_characters.push(<span onClick={goToPage} id={`/characters/${listOfCol[index][2][char_out]}`}>{listOfCol[index][2][char_out]}</span>)
                collection_outfits.push(<span onClick={goToPage} id={`/my-outfits/${encodeURIComponent(listOfCol[index][3][char_out])}`}>{listOfCol[index][3][char_out]}</span>)
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
        <div className="container">
        <h1>Welcome to your collections page</h1>
            <div className="d-flex flex-column">
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
                <img onClick={goToCOl} id={`/characters/${encodeURIComponent(cur_char["char_name"])}`} src={cur_char["char_img"]}/>
            );
        }
        return lst
    }

    function outfitInCol(){
        const lst = []
        for (let index in collection_info.outfit_list){
            let curr_out = collection_info.outfit_list[index]
            lst.push(
                <div onClick={goToCOl} id={`/my-outfits/${encodeURIComponent(curr_out)}`} className="border-top border-bottom border-secondary">{curr_out}</div>
            );
        }
        return lst
    }

    return(
        <div className="container">
            <h3 className="align-self-center">{collection_info.collection_name}</h3><br/>
            <div className="d-flex flex-column">
                <span>Characters in collection: </span>
                <div className="border border-secondary rounded" style={{height: "200px"}}>
                    {characterInCol()}
                </div>
            </div><br/>
            <div className="d-flex flex-column">
                <span>Outfits in collection: </span>
                <div className="border border-secondary rounded overflow-auto" style={{height: "200px"}}>
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

