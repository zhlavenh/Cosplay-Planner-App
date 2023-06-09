// function getUserCreations(){
//     const [userCreations, setUserCreations] = React.useState({userOutfits: {}, userCollections: {}});

//     // React.useEffect(()=>{
//     //     fetch(/)
//     // });
// }

function UserInfo(props){



    return(
        <div>
            <h6>Username: {props.user_name}</h6>
            <h6>Member since: {props.member_since}</h6>
            <h6>Outfits created: {props.count_outfits}</h6>
            <h6>Collections created: {props.count_collect}</h6>
        </div>
    );
}

function UserCollections(props){
    const collecInfo = props.collecInfo[0]

    function displayCollection(){
        let content = []
        for (const index in collecInfo){
            let collectionName = collecInfo[index][0];
            let collectionUpdated = collecInfo[index][1];
            let num_out = collecInfo[index][2];
            let isActive = ""
            if (index == 0){
                isActive = "active"
            }

            content.push(
                <div className={`carousel-item ${isActive}`} >
                    <a href={`/my-collections`}className="d-flex flex-column justify-content-center align-items-center collect-card w-100"  style={{aspectRatio: "1/1"}}>
                        <div className="text-wrap text-center">{collectionName}</div><br/>
                        <div className="">Last Edited On: {collectionUpdated}</div><br/>
                        <div className="">Number of Outfits: {num_out}</div>
                    </a>
                </div>

    );
        }
        
        return content;
    }
    
    return(
        <React.Fragment >
            {displayCollection()}
        </React.Fragment>
    );
}
function UserOutfits(props){
    const outfitInfo = props.outfitInfo[0]

    function displayOutfit(){
        let content = []
        for (const index in outfitInfo){
            let outfitName = outfitInfo[index][0];
            let charImg = outfitInfo[index][1];

            let isActive = ""
            if (index == 0){
                isActive = "active"
            }

            content.push(
                <div className={`carousel-item ${isActive}`} >
                    <a href={`/my-outfits/${encodeURIComponent(outfitName)}`} className="d-flex justify-content-evenly align-items-center outfit-card w-100" style={{aspectRatio: "1/1"}}>
                        <img className="h-50 w-auto m-4" src={charImg}/>
                        <div className="me-4 out-name">{outfitName}</div>

                    </a>
                </div>
            );

        }
        
        return content;
    }
    
    return(
        <React.Fragment>
            {displayOutfit()}
        </React.Fragment>
    );
}


function Display(){
    const info = {user_name: "", member_since: "", count_outfits: 0, count_collect: 0, collecInfo: "", outfitInfo: ""}
    const [userInfo, setInfo] = React.useState(info);

    React.useEffect(()=>{
        fetch('/acct_info')
        .then((response)=>response.json())
        .then((info)=>{
            setInfo({...userInfo, user_name: [info.user_name], member_since: [info.date_created], count_outfits: [info.count_outfits], 
            count_collect: [info.count_collect], collecInfo: [info.collectionInfo], outfitInfo: [info.outfitInfo]})
        });
    }, []);

    return (
        <div className="row p-2">
            <div className="col-2 p-2 user-info" style={{height: "250px"}}><UserInfo user_name={userInfo.user_name} member_since={userInfo.member_since} count_collect={userInfo.count_collect} count_outfits={userInfo.count_outfits}/></div>
            <div className="col-9 p-2" >
                <div className="d-flex justify-content-between  car-boxes" style={{height: screen.height}}>
                    <div className="w-50 d-flex flex-column m-2">
                        <h6>Your collections</h6>
                        <div className="carousel slide align-self-center w-100" id="collection-carousel" data-bs-ride="carousel" >
                            <div className="carousel-inner" >
                                <UserCollections collecInfo={userInfo.collecInfo}/>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#collection-carousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#collection-carousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                    <div className="w-50 d-flex flex-column m-2">
                        <h6>Your outfits</h6>
                        <div className="carousel slide align-self-center w-100" id="outfit-carousel" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                <UserOutfits outfitInfo={userInfo.outfitInfo}/>
                            </div>
                            <button className="carousel-control-prev" type="button" data-bs-target="#outfit-carousel" data-bs-slide="prev">
                                <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Previous</span>
                            </button>
                            <button className="carousel-control-next" type="button" data-bs-target="#outfit-carousel" data-bs-slide="next">
                                <span className="carousel-control-next-icon" aria-hidden="true"></span>
                                <span className="visually-hidden">Next</span>
                            </button>
                        </div>
                    </div>
                </div>

            </div>
            <div className="col-1 welcome-text mt-4 pt-2"><h3>WELCOME BACK!</h3></div>
        </div>

    );
}

ReactDOM.render(<Display />, document.getElementById("user_account"));