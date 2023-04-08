function Hello(){
    return (
        <div>
            <h1>This is the homepage for cosplay planner</h1>
            <div className="card-group">
                <div className="card" style={{width: "18rem"}}>
                    <div className="card-body">
                        <h5 className="card-title">All Anime</h5>
                        <p className="card-text">Don't know what anime you want to cosplay from next? Click below for all the shows/movies and their characters.</p>
                        <a href="/shows" className="btn btn-primary">Go to all animes</a>
                    </div>
                </div>
                <div className="card" style={{width: "18rem"}}>
                    <div className="card-body">
                        <h5 className="card-title">All Characters</h5>
                        <p className="card-text">Don't know who you want to insipre your next cosplay? Click below for a list of all characters.</p>
                        <a href="characters" className="btn btn-primary">Go to all characters</a>
                    </div>
                </div>
            </div>

        </div>

    );
}

ReactDOM.render(<Hello />, document.getElementById("homepage"));
