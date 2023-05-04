function Display(){



    return (
        <div className="container d-flex justify-content-between vh-100">
            <div className="welcome-text d-flex flex-column justify-content-center m-1">
                <h1>Welcome to the Cosplay Planner</h1>
                <p>
                    Here you can create outfits based on your favorite characters.
                    You can also build collections of your outfits, making planning for various con days a breeze.
                </p>
            </div>

            <div className="card-group d-flex flex-column justify-content-evenly">
                <div className="all-card m-1 p-1 rounded d-flex flex-column justify-content-center" >
                    <div className="d-flex flex-column align-items-center" >
                        <h5 className="">All Anime</h5>
                        <p className="text-center">Don't know what anime you want to cosplay from next? Click below for all the shows/movies and their characters.</p>
                        <a href="/shows" className="btn btn-primary">Go to all animes</a>
                    </div>
                </div>
                <div className="all-card m-1 p-1 rounded d-flex flex-column justify-content-center">
                    <div className="d-flex flex-column align-items-center">
                        <h5 className="">All Characters</h5>
                        <p className="text-center">Don't know who you want to insipre your next cosplay? Click below for a list of all characters.</p>
                        <a href="characters" className="btn btn-primary">Go to all characters</a>
                    </div>
                </div>
            </div>

        </div>

    );
}

ReactDOM.render(<Display />, document.getElementById("homepage"));
