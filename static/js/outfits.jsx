function CreateNewCard(){
    return(
        <React.Fragment>
            <div className="col-md-auto col-sm-1 mb-1">
                <div className="card" style={{padding: 'auto 12px'}}>
                    <div className="card-body d-flex align-items-center justify-content-center" >
                        <a role="button" className="btn d-flex align-items-center justify-content-center" style={{width: '50%', height: '50%'}} href="/create/new-outfit">
                            <i className="bi bi-plus-circle" style={{fontSize: '60px'}}></i>
                        </a>   
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function OutfitCard(props){
    return(
            <div className="col-md-auto col-sm-1 mb-1 ">
                <div className="card outfit-card" >
                    <div className="card-body d-flex flex-column align-items-center justify-content-between h-100">
                        <img className="card-img-top" src={props.charImg} alt="show_title" style={{width: "auto", height: "50%"}}/>
                        <p className="card-title text-dark">{props.outfitName}</p>
                        <a href={`/my-outfits/${encodeURIComponent(props.outfitName)}`} className="out-btn d-flex align-items-center justify-content-center">View Outfit</a>
                    </div>
                </div>
            </div>
    );
}

function AllUserOutfits(){
    const [userOutfits, setUserOutfits] = React.useState();
    const [outfitInfo, setOutfitInfo] = React.useState();

    function displayOutfits(){
        let content = []
        for (let index in outfitInfo) {
            let outfitName = outfitInfo[index][0]
            let charImg = outfitInfo[index][1]
            content.push(<OutfitCard charImg={charImg} outfitName={outfitName} />);
          }
        return content;
    }

    React.useEffect(()=>{
        fetch("/acct_info")
        .then((response) => response.json())
        .then((acct_info) => {
            setOutfitInfo(acct_info.outfitInfo);
            
        });
    }, []);


    return (
        <div className="vh-100 d-flex flex-column">
            <h1 className="align-self-center out-header">Welcome to your outfits page</h1><br/>
            <div className="row ">
                <CreateNewCard />
                {displayOutfits()}
            </div>

        </div>

    );
}

function IndOutfit(){
    const outfitName = {name: decodeURIComponent(window.location.pathname).slice(12)};
    const [outfitInfo, setOutfitInfo] = React.useState({collecitons_in: ""});
    const [userCollections, setUserCollections] = React.useState([]);
    const [updateInfo, setUpdateInfo] = React.useState({current_outfit: "", change_name: null, remove_col: null, 
                                                        add_col: null, notes: null})

    React.useEffect(() => {
        fetch('/get_outfit_info', {
            method: "POST",
            body: JSON.stringify(outfitName),
            headers: {'Content-Type': 'application/json',},
        })
        .then((response) => response.json())
        .then((responseJSON) => {
            setOutfitInfo(responseJSON);
            setUpdateInfo({...updateInfo, current_outfit: responseJSON.outfit_name, change_name: null, remove_col: null, 
                            add_col: null, notes: null})
        });
    }, []);

    React.useEffect(() => {
        fetch("/user_creations")
        .then((response) => response.json())
        .then((responeJSON) =>{
            setUserCollections(responeJSON.collection_names);
        });
    }, []);

    function goToCOl(evt){
        window.location = evt.target.id;
    }

    function collectionList(){
        const colList = [];
        
        for (let index in outfitInfo["collecitons_in"]){
            let currCol = outfitInfo["collecitons_in"][index];
            colList.push(<div onClick={goToCOl} id={"/my-collections"} className="border-top border-bottom border-secondary collect-text">{currCol}</div>);
        }

        return colList
    }


    function updateOutfit(evt){
        const current_modal = evt.target.id

        if (current_modal == "name_changed"){
            const new_name = document.getElementById("new-outfit-name").value;
            setUpdateInfo({...updateInfo, change_name: new_name})
            window.location = `/my-outfits/${encodeURIComponent(new_name)}`
        }
        else if (current_modal == "update_collections_add"){
            const form_inputs = new Set(document.getElementById("add_collections").elements);
            const coll_list = [];
            for (let item of form_inputs){
                if (item.checked){
                    coll_list.push(item.name);
                }
            }
            setUpdateInfo({...updateInfo, add_col: coll_list})
            location.reload();
        }
        else if (current_modal == "update_collections_delete"){
            const form_inputs = new Set(document.getElementById("delete_collections").elements);
            const coll_list_del = [];
            for (let item of form_inputs){
                if (item.checked){
                    coll_list_del.push(item.name);
                }
            }
            console.log(coll_list_del)
            setUpdateInfo({...updateInfo, remove_col: coll_list_del})
            location.reload();

        }
        else if (current_modal == "update_notes"){
            const form_inputs = document.getElementById("updated_notes").elements[0];
            const new_notes = form_inputs.value
            setUpdateInfo({...updateInfo, notes: new_notes})
            location.reload();

        }
        else if (current_modal == "delete_outfit"){
            console.log("deleting outfit....")
            const formAction = {action: "delete_outfit", outfit_name: outfitInfo.outfit_name}
            fetch('/delete_creation', {
                method: "POST",
                body: JSON.stringify(formAction),
                headers: {'Content-Type': 'application/json',},
            })
            .then((response) => response.json())
            .then((responeJSON) =>{
                alert("outfit deleted");
                window.location = '/my-outfits';
            });
        }


    }


    function collLabel(){
        const lst =[]

        for (let index in userCollections){
            let currCol = userCollections[index];

            if (!Object.values(outfitInfo["collecitons_in"]).includes(currCol)){
                lst.push(
                    <div className="form-check">
                        <input className="" type="checkbox" name={currCol} id="" />
                        <label className="form-check-label" htmlFor="">{currCol}</label>
                    </div>
                );
            }

        }
        
        return lst
    }

    React.useEffect(() => {
        fetch('/update_outfit', {
            method: "POST",
            body: JSON.stringify(updateInfo),
            headers: {'Content-Type': 'application/json',},
        })
        .then((response) => response.json())
        .then((responeJSON) =>{
            
        });
    }, [updateInfo]);

    return (
        <div className="vh-100 p-3">
            <div className="d-flex">
                <img src={outfitInfo.based_on_img} style={{height: "300px", width: "200px"}}/>
                <div className="d-flex flex-column w-100 p-2 justify-content-between">
                    <div className="d-flex">
                        <h3><span>Outfit Name: </span>{outfitInfo.outfit_name}</h3>
                        <button className="btn btn-secondary m-2" data-bs-toggle="modal" data-bs-target="#updateOutfit">Change outfit name</button>
                    </div>
                    
                    <h3><span>Based on: </span>{outfitInfo.based_on}</h3>
            {/* Collections */}
                    <div className="d-flex flex-column">
                        <div className="d-flex justify-content-between">
                            <span className="d-flex align-items-end">Appears in Collections: </span>
                            <button className="btn btn-secondary m-2" data-bs-toggle="modal" data-bs-target="#updateCollectionAdd">Add to collections</button>
                            <button className="btn btn-secondary m-2" data-bs-toggle="modal" data-bs-target="#updateCollectionDelete">Delete from collections</button>
                        </div>
                        <div className="border border-secondary rounded overflow-auto" style={{height: "100px"}}>{collectionList()}</div>
                    </div>
                </div>
            </div>
            {/* Notes */}
            <div className="d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <span className="d-flex align-items-end">Notes: </span>
                    <button className="btn btn-secondary m-2" data-bs-toggle="modal" data-bs-target="#updateNotes">Edit outfit notes</button>
                </div>

                <div className="border border-secondary rounded overflow-auto notes-block" style={{height: "200px"}}>{outfitInfo.notes}</div>
            </div><br/><br/>
            <div>
                <button className="border border-secondary rounded bg-danger text-white" data-bs-toggle="modal" data-bs-target="#deleteOutfit">Delete Outfit</button>
            </div>

            {/* Modal functionality */}

            {/* Outfit name */}
            <div className="modal fade" id="updateOutfit" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 class="modal-title">Change outfit name</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="input-group">
                                    <label className="m-1">New Outfit Name: </label>
                                    <input type="text" id="new-outfit-name" className="col"/>
                                </div>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-secondary" id="name_changed" data-bs-dismiss="modal" onClick={updateOutfit}>Submit changes</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Collections */}
            <div className="modal fade" id="updateCollectionAdd" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5>Add outfit to colletions</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="add_collections">
                                {collLabel()}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="update_collections_add" onClick={updateOutfit}>Submit changes</button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="modal fade" id="updateCollectionDelete" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
                <div className="modal-dialog modal-dialog-scrollable">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5>Remove outfit from colletions</h5>
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="delete_collections">
                                {Object.values(outfitInfo["collecitons_in"]).map((name) => 
                                    <div className="form-check">
                                        <input className="" type="checkbox" name={name} id="" />
                                        <label className="form-check-label" htmlFor="">{name}</label>
                                    </div>
                                )}
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="update_collections_delete" onClick={updateOutfit}>Submit changes</button>
                        </div>
                    </div>
                </div>
            </div>
            {/* Notes */}
            <div className="modal fade" id="updateNotes" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <form id="updated_notes">
                            <textarea className="form-control" rows="4" id="" defaultValue={outfitInfo.notes}></textarea>
                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="update_notes" onClick={updateOutfit}>Submit changes</button>
                        </div>
                    </div>
                </div>
            </div>            
            {/* Delete outfit */}
            <div className="modal fade" id="deleteOutfit" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div className="modal-body">
                            <h4>Deleting this outfit is permanent. You will have to create a new outfit. Are you sure?</h4>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">No. Do not delete.</button>
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal" id="delete_outfit" onClick={updateOutfit}>Yes. I am sure.</button>
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    );
}

// Page Renders
const currentURL = window.location.pathname;
if (currentURL === "/my-outfits"){
    ReactDOM.render(<AllUserOutfits />, document.getElementById("user_outfits"));
}
else if (currentURL.startsWith("/my-outfits/")){
    ReactDOM.render(<IndOutfit />, document.getElementById("user_outfit"));
}