function CreateNewCard(){
    return(
        <React.Fragment>
            <div className="col-md-auto col-sm-1 mb-1">
                <div className="card" style={{width: '10rem', height: '160px', padding: 'auto 12px'}}>
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
            <div className="col-md-auto col-sm-1 mb-1">
                <div className="card" style={{width: '10rem', height: '160px'}}>
                    <div className="card-body d-flex flex-column align-items-center justify-content-center">
                        <img className="card-img-top" src={props.charImg} alt="show_title" style={{width: "auto", height: "60px"}}/>
                        <p className="card-title">{props.outfitName}</p>
                        <a href="" className="btn btn-primary">Click to open</a>
                    </div>
                </div>
            </div>
    );
}



function Display(){
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
        <div className="container">
            <h1>Welcome to your outfits page</h1>
            <div className="row">
                <CreateNewCard />
                {displayOutfits()}
            </div>

        </div>

    );
}


ReactDOM.render(<Display />, document.getElementById("user_outfits"));