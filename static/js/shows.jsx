

function ShowCard(props){

    return(
        <React.Fragment>
            <div className="col">
                <div className="card" style={{width: '10rem'/*, margin: '5px'*/}}>
                    <div className="card-body">
                        <img className="card-img-top" src={props.show_img} alt="show_title"/>
                        <h5 className="card-title">{props.show_title}</h5>
                        <a href="" className="btn btn-primary">{props.show_title}</a>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function ShowRow(){
    const [shows, setShows] = React.useState([])

    // React.useEffect(() => {
    //     fetch('/disp_all_anime')
    //     .then((response) => response.json())
    //     .then((serverData) => {
    //         console.log(serverData.data.Page.characters.length);
    //         const characters = serverData.data.Page.characters;
    //         setShows(characters);
    //     });
    //   }, []);
    React.useEffect(() => {
        fetch('/disp_all_anime')
        .then((response)=>response.json())
        .then((severData)=>{
            setShows(severData.data.Page.media);
        });
    }, []);

    function displayAnime(){
    let content = []
    for (let i = 0; i < shows.length ; i++) {

        const show_img = shows[i].coverImage.medium;
        const show_title= shows[i].title.english;
        const japanese_title = shows[i].title.native;

        content.push(<ShowCard show_img={show_img} show_title={show_title}/>);
        }

    return content;
    }

    return(
        <React.Fragment>
            <div className="row">
                {displayAnime()}
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