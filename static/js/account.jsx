function getUserCreations(){
    const [userCreations, setUserCreations] = React.useState({userOutfits: {}, userCollections: {}});

    // React.useEffect(()=>{
    //     fetch(/)
    // });
}

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
            content.push(
                        <React.Fragment>
                            <a href="" className="d-flex flex-column justify-content-center align-items-center border border-secondary rounded m-3 p-2" style={{width: "160px", height: "150px"}}>
                                <div className="row">{collectionName}</div>
                                <div className="row">{collectionUpdated}</div>
                            </a>
                        </React.Fragment>
    );
        }
        
        return content;
    }
    
    return(
        <div className="d-flex justify-content-start flex-wrap" >
            {displayCollection()}
        </div>
    );
}
function UserOutfits(props){
    const outfitInfo = props.outfitInfo[0]

    function displayOutfit(){
        let content = []
        for (const index in outfitInfo){
            let outfitName = outfitInfo[index][0];
            let charImg = outfitInfo[index][1];
            content.push(
            <React.Fragment>
                <a href="" className="d-flex flex-column justify-content-center align-items-center border border-secondary rounded m-3 p-2" style={{width: "160px", height: "150px"}}>
                    <div className="row">{outfitName}</div>
                    <div className="row">{charImg}</div>
                </a>
            </React.Fragment>
            );
        }
        
        return content;
    }
    
    return(
        <div className="d-flex justify-content-start flex-wrap" >
            {displayOutfit()}
        </div>
    );
}
// function ShowCard(props){


//     return(
//         <React.Fragment>
//             {/* <a href="" className="d-flex flex-column justify-content-center align-items-center border border-secondary rounded m-3 p-2" style={{width: "160px", height: "150px"}}>
//                 <div className="row">{props.colName ? props.colName : props.outName}</div>
//                 <div className="row">{props.imgUrl ? props.imgUrl : `Last Updated:  ${props.updated}`}</div>
//             </a> */}
//         </React.Fragment>
//     )
// }

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
        <div className="row">
            <div className="col-3 p-2" style={{height: "250px"}}><UserInfo user_name={userInfo.user_name} member_since={userInfo.member_since} count_collect={userInfo.count_collect} count_outfits={userInfo.count_outfits}/></div>
            <div className="col-9 p-2" >
                <div className="d-flex flex-column" style={{height: screen.height}}>
                    <h6>Your collections</h6>
                    <div className="overflow-auto h-50 p-2 mb-1">
                        <UserCollections collecInfo={userInfo.collecInfo}/>
                    </div>
                    <h6>Your outfits</h6>
                    <div className="overflow-auto h-50 p-2">
                        <UserOutfits outfitInfo={userInfo.outfitInfo}/>
                    </div>
                </div>

            </div>
        </div>

    );
}

ReactDOM.render(<Display />, document.getElementById("user_account"));