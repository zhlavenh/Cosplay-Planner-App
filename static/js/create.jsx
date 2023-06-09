// User create new outfit
function OutfitForm(){
    const initialForm ={formType: null, outfit_name: null, outfit_public: null, 
        character_name: null, collection_name: null, collection_public: null, outfit_notes: null};
    const [formToShow, setFormToShow] = React.useState("noCol");
    const [dispForm, setDispForm] = React.useState(false);
    const [listOfColl, setListOfColl] = React.useState([]);
    const [formInfo, setFormInfo] = React.useState(initialForm)


    React.useEffect(()=>{
        if (formToShow=="createNew"){
            setDispForm(<AddCreateForm/>);
        }
        else if (formToShow=="useExist"){
            fetch('/user_creations')
            .then((response)=>response.json())
            .then((serverData)=>{
                setListOfColl(serverData.collection_names);
            });
           
        } else {setFormToShow(false), setDispForm(false)}
    }, [formToShow]);

    React.useEffect(()=>{
        setDispForm(<AddSearchBox listOfColl={listOfColl}/>);
    }, [listOfColl]);

    function getFormInfo(evt){
        evt.preventDefault();
        const outfitName = document.getElementById("outfitName").value;
        const charName = document.getElementById("character_name").value;
        const outfitPublic = document.getElementById("outfitPublicStatus").value;
        const outfitNotes = document.getElementById("outfit_notes").value;

        if (formToShow=="createNew"){
            const collectionName = document.getElementById("newCollectionName").value;
            const collectionPublic = document.getElementById("collectionPublic").value;
            setFormInfo({...formInfo, outfit_name: outfitName, character_name: charName, outfit_public: outfitPublic, formType: formToShow, collection_name: collectionName, collection_public: collectionPublic, outfit_notes: outfitNotes});
        }
        else if (formToShow=="useExist"){
            const collectionName = document.getElementById("existColName").value;
            console.log(collectionName);
            setFormInfo({...formInfo, outfit_name: outfitName, character_name: charName, 
                outfit_public: outfitPublic, formType: formToShow, 
                collection_name: collectionName, outfit_notes: outfitNotes});
        } 
        else {
            setFormInfo({...formInfo, outfit_name: outfitName, character_name: charName, outfit_public: outfitPublic, formType: formToShow, 
                outfit_notes: outfitNotes})
        }

    }

    React.useEffect(()=>{
        fetch('/create_new_outfit',{
            method: 'POST',
            body: JSON.stringify(formInfo),
            headers: {'Content-Type': 'application/json',}
        })

        .then((response)=>response.json())
        .then((responseJSON)=>{
            window.location.href = "/my-outfits"
        });
    }, [formInfo]);


    return(
        <form>
            <div className="d-flex justify-content-between row">
                <div className="col-6 form-group">
                    <label htmlFor="outfitName">Outfit name</label>
                    <input type="outfitName" className="form-control" id="outfitName" placeholder="Name of outfit"/>
                </div>
                <div className="col-6 form-group">
                    <label htmlFor="characterName">Search for a character</label>
                    <SearchCharacterName />
                </div>
            </div>
            <div className="d-flex row justify-content-between">
                <div className="d-flex flex-column col-6 form-group">
                    <label className="" htmlFor="outfitPublic">This outfit is: </label>
                    <button className=" btn btn-outline-secondary publicStatus" id="outfitPublicStatus" onClick={statusButtonClick} value="Public" >Public - May be featured on our homepage. Click to change to private.</button>
                </div>
                <div className="d-flex flex-column col-6 form-group ">
                    <label className="" htmlFor="outfitName">Add to collection: </label>
                    <SearchUserCollections changeForm={setFormToShow}/>
                </div>
            </div><br/>
            <div className="d-flex row">
                <div className="d-flex flex-column col form-group" >
                    <label htmlFor="outfitName">Add Outfit Notes:</label>
                    <textarea className="form-control" rows="4" id="outfit_notes" placeholder="Outfit notes..."></textarea>
                </div>
            </div><br/>
            <div className="d-flex row justify-content-between" id="userForm">
                {dispForm}
            </div>
            <br/><button type="submit" className="btn btn-primary" onClick={getFormInfo}>Submit</button>
        </form>
    );
}
function AddCreateForm(){
    return(
        <React.Fragment>
            <div className="d-flex flex-column col-6 form-group">
                <label htmlFor="collectionName">Collection Name:</label>
                <input type="text" className="form-control collectionName" id="newCollectionName" placeholder="Name of Collection"/>
            </div>
            <div className="d-flex flex-column col-6 form-group">
                <label htmlFor="collectionName">The collection will be:</label>
                <button className=" btn btn-outline-secondary" id="collectionPublic" onClick={statusButtonClick} value="Public" >Public - May be featured on our homepage. Click to change to private.</button>
            </div>
        </React.Fragment>
    );

}
function AddSearchBox(props){
    return(
        <React.Fragment>
            <div className="d-flex flex-column col form-group">
                <label htmlFor="collectionName">Select a collection:</label>
                <select className="form-select collection_name" id="existColName" defaultValue="00" /*onClick={loadDropDown}*/>
                    <option value="0">Select a collection...</option>
                    {props.listOfColl.map((name, index) => 
                    (<option value={name}>{name}</option>))}
                </select>
            </div>
        </React.Fragment>
    );
}
function statusButtonClick(evt){
    evt.preventDefault();
    if (evt.target.value == "Public"){
        evt.target.value = "Private";
        evt.target.innerHTML = "Private - Only you can see it. Click to change to public."
    } else {evt.target.value = "Public"; evt.target.innerHTML = "Public - May be featured on our homepage. Click to change to private."}
}
function SearchUserCollections(props){
    const [colType, setColType] = React.useState("teaser");

    function changeColForm(evt){
        setColType(evt.target.value);
    }

    React.useEffect(()=>{
        props.changeForm(colType);
    }, [colType]);


    return (
        <div>
            <select className="form-select" id="" defaultValue="00" onChange={changeColForm}>
                <option value="0">Choose an option:</option>
                <option value="noCol">No Collection</option>
                <option value="createNew">Create New Collection</option>
                <option value="useExist">Choose from Existing</option>
            </select>
        </div>
    );
}
function SearchCharacterName(){
    const [characterName, setCharacterName] = React.useState({name: ""});
    const [options, setOptions] =  React.useState([]);
    const [isDropDown, setDropDown] = React.useState(true);

    function filterFunction(evt){
        evt.preventDefault();
        setDropDown(true);
        let input = document.getElementById("character_name").value;
        const searchInput = {name: input};
        setCharacterName(searchInput);
    }

    function addFromDropDown(evt){
        evt.preventDefault();
        const inputField = document.getElementById("character_name");
        inputField.value = evt.target.innerHTML;
        setDropDown(false);
    }


    function dropDown(){
        let content = []
        for (let i = 0; i < options.length ; i++) {
            const retCharacter = options[i];
            content.push(<button className="btn btn-outline-secondary" type="button" value={retCharacter.name.full} onClick={addFromDropDown}>{retCharacter.name.full}</button>);
        }
        return content;
    }

    React.useEffect(() => {
        fetch('/find_character',{
            method: 'POST',
            body: JSON.stringify(characterName),
            headers:{'Content-Type': 'application/json'},
        })
        .then((response)=>response.json())
        .then((serverData)=>{
            setOptions(serverData.data.Page.characters);
            dropDown
        });
    }, [characterName]);


    return (
        <div>
            <input type="text" className="input-group form-control" placeholder="Search.." id="character_name" onInput={filterFunction} defaultValue=""></input>
            <menu className="p-0">
                {isDropDown ? dropDown() : false}
            </menu>


        </div>

    );
}
function CreateNewOutfit(){

    return (
        <div className="vh-100">
            <h1>Create a new outfit here</h1>
            <OutfitForm/>
        </div>
    );
}

// User create new collection
function CreateNewCollection(){
    const [showOutfitList, setShowOutfitList] = React.useState(false);
    const [outfits, setOutfits] = React.useState();
    const [formInfo, setFormInfo] = React.useState();

    function handleOutfitClick(evt){
        evt.preventDefault();
        if (evt.target.value == "Yes"){
            evt.target.value = "No";
            evt.target.innerHTML = "No, I want to create an empty collection.";
            setShowOutfitList(true);
        } else {evt.target.value = "Yes"; evt.target.innerHTML = "Yes, I want to add outfits now."; setShowOutfitList(false)}
    }

    function outfitList(){
        let content = []
        for (let index in outfits){
            content.push(<option value={outfits[index][0]}>{outfits[index][0]}</option>);
        }
        return content;
    }

    function submitForm(evt){
        evt.preventDefault();
        const collectionName = document.getElementById("collectionName").value
        const colllectionPublic = document.getElementById("collectionPublicStatus").value
        if (showOutfitList){
            const outfitLists = document.getElementById("outfitdropdownlist").selectedOptions
            const outfitsSelected = new Set()
            for (let index in outfitLists){
                outfitsSelected.add(outfitLists.item(index).value);
            }
            setFormInfo({collection_name: collectionName, public: colllectionPublic, outfitsList: Array.from(outfitsSelected)});

        } else {setFormInfo({collection_name: collectionName, public: colllectionPublic, outfitsList: []});}
    }

    React.useEffect(() => {
        fetch("/acct_info")
        .then((response)=>response.json())
        .then((responseJSON)=>{
            setOutfits(responseJSON.outfitInfo);
        });
    }, [showOutfitList]);

    React.useEffect(()=>{
        console.log(formInfo);
        fetch('/create_new_col',{
            method: 'POST',
            body: JSON.stringify(formInfo),
            headers: {'Content-Type': 'application/json',}
        })

        .then((response)=>response.json())
        .then((responseJSON)=>{
            window.location.href = "/my-collections";
        });
    }, [formInfo]);


    return(
        <div className="vh-100 d-flex flex-column">
            <h1 className="align-self-center">Create a new collection here</h1><br/>
            <form id="collecitonForm">
                <div className="d-flex justify-content-between row">
                    <div className="col-6 form-group">
                        <label htmlFor="collectionName">Collection name</label>
                        <input type="" className="form-control" id="collectionName" placeholder="Name of collection..."/>
                    </div>
                    <div className="d-flex flex-column col-6 form-group">
                        <label className="" htmlFor="outfitPublic">This colleciton is: </label>
                        <button className=" btn btn-outline-secondary publicStatus" id="collectionPublicStatus" onClick={statusButtonClick} value="Public" >Public - May be featured on our homepage. Click to change to private.</button>
                    </div>
                </div><br/>
                <div className="d-flex row">
                    <div className="d-flex col form-group">
                            <label className="col-3" htmlFor="outfitPublic">Do you want to add any outfits you have created: </label>
                            <button className="col-9 btn btn-outline-secondary publicStatus" id="addOutfits" onClick={handleOutfitClick} value="Yes" >Yes, I want to add outfits now.</button>
                    </div>
                </div><br/>
                <div className="d-flex row">
                    {showOutfitList ? 
                        (<select className="form-select" multiple id="outfitdropdownlist" data-bs-toggle="tooltip" data-bs-placement="top" title="Hold shift to add multiple outfits" style={{height: "100px"}}>
                                {outfitList()}
                        </select>)
                        : false}
                </div>
                <br/><button type="submit" className="btn btn-primary" onClick={submitForm}>Submit</button>
            </form>
        </div>

    );
}

// Base page to select which create page
function BaseCreatePage(){
    return(
        <h1>This is the base page for creating new things</h1>
    );
}

// Page Renders
const currentURL = window.location.pathname;
if (currentURL == "/create/new-outfit"){
    ReactDOM.render(<CreateNewOutfit />, document.getElementById("create_new_outfit"));
}
else if (currentURL == "/create/new-collection"){
    ReactDOM.render(<CreateNewCollection />, document.getElementById("create_new_collection"));
}
else{
    ReactDOM.render(<BaseCreatePage/>, document.getElementById("create_base"));
}
