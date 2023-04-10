function CreateNewCard(){
    return(
        <React.Fragment>
            <div className="col-md-auto col-sm-1 mb-1">
                <div className="card" style={{width: '10rem', height: '160px', padding: 'auto 12px'}}>
                    <div className="card-body d-flex align-items-center justify-content-center" >
                        <a role="button" className="btn d-flex align-items-center justify-content-center" style={{width: '50%', height: '50%'}}href="/create">
                            <i className="bi bi-plus-circle" style={{fontSize: '60px'}}></i>
                        </a>   
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function OutfitCard(){
    return(
            <div className="col-md-auto col-sm-1 mb-1">
                <div className="card" style={{width: '10rem'}}>
                    <div className="card-body">
                        <img className="card-img-top" src="..." alt="show_title"/>
                        <h5 className="card-title">Show Title</h5>
                        <p className="card-text"></p>
                        <a href="/shows" className="btn btn-primary">Go to all animes</a>
                    </div>
                </div>
            </div>
    );
}

// need to put a loop in here for how ever many outfits they have to show and wrap screen
// function CardRow(){


//     return(
//         <React.Fragment>
//             <div className="row">
//                 <OutfitCard/>
//                 <OutfitCard/>
//                 <OutfitCard/>
//                 <OutfitCard/>
//                 <OutfitCard/>
//                 <OutfitCard/>
//             </div>
//         </React.Fragment>
//     );
// }

function Display(){


    function displayOutfits(){
        let content = []
        for (let i = 0; i < 20; i++) {
            content.push(<OutfitCard/>);
          }
        return content;
    }


    return (
        <div className="container">
            <h1>This is the user's outfits page</h1>
            <div className="row">
                <CreateNewCard />
                {displayOutfits()}
            </div>

        </div>

    );
}


ReactDOM.render(<Display />, document.getElementById("user_outfits"));