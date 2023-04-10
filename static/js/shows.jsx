

function ShowCard(props){

    return(
        <React.Fragment>
            <div className="col">
                <div className="card" style={{width: '10rem'/*, margin: '5px'*/}}>
                    <div className="card-body">
                        <img className="card-img-top" src="..." alt="show_title"/>
                        <h5 className="card-title">{props.id}</h5>
                        <p className="card-text"></p>
                        <a href="/shows" className="btn btn-primary">Go to all animes</a>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function ShowRow(){
    const [shows, setShows] = React.useState([])

    React.useEffect(() => {
        fetch('/disp_all_anime')
        .then((response) => response.json())
        .then((serverData) => {
            setShows(serverData.data.Media.id);
        });
      }, []);

      console.log(shows);
    return(
        <React.Fragment>
            <div className="row">
                <ShowCard id={shows} />
                <ShowCard id={shows} />
                <ShowCard id={shows} />
                <ShowCard id={shows} />
                <ShowCard id={shows} />
                <ShowCard id={shows} />
            </div>
        </React.Fragment>
    );
}

function AllShows(){
    return (
        <div className="container">
            <h1>This is a page for all shows</h1>
            <ShowRow/>
        </div>

    );
}

ReactDOM.render(<AllShows />, document.getElementById("shows"));