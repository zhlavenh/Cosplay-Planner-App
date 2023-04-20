function CreateNewCard(){
    return(
        <React.Fragment>
            <a className="col border border-secondary rounded m-1" role="button" href="/create/new-outfit">
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
    return (
    <a className="col border border-secondary rounded m-1">
        <div className="row">
            <div className="col-6">
                {props.collection_name}
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
    </a>
    );
}

function Display(){
    const [listOfCol, setListOfCol] = React.useState()

    function displayCols(){
        let content = []
        for (let index in listOfCol){
            let collection_name = listOfCol[index][0]
            let collection_LUPD = listOfCol[index][1]
            let collection_characters = []
            let collection_outfits =[]
            for (let char_out in listOfCol[index]){
                collection_characters.push(<span>{listOfCol[index][2][char_out]}</span>)
                collection_outfits.push(<span>{listOfCol[index][3][char_out]}</span>)
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
            console.log(serverData.collections_info[1][2]);
            setListOfCol(serverData.collections_info);
        });
    }, []);

    return (
        <div className="container">
        <h1>Welcome to your collections page</h1>
            <div className="d-flex flex-column">
                {displayCols()}
            </div>
            <div className="row">
                <CreateNewCard />
            </div>
        </div>

    );
}


ReactDOM.render(<Display />, document.getElementById("user_collections"));