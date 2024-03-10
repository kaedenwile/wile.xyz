import './home.css';

export const Home = () => {
    return (
        <div id="website">
            <h1 className="no-select">wile.xyz</h1>

            <div id="body">
                <div id="links">
                    <a href="/belt">belt</a>
                    <a href="/colony">colony</a>
                    <a href="/music">music</a>
                    <a href="https://beta.musicalert.app">musicalert</a>
                    <a>about</a>
                    <a>contact</a>
                </div>

                <div className="content-container">
                    <div id="about" className="content">
                        <p>Hi there! I'm Kaeden Wile, and this is my personal website.</p>
                        <p>
                            I currently work as a Software Engineer 3 and Tech Lead at
                            <a href="https://www.asurion.com">Asurion</a>, building a library of front-end components
                            for teams across the company. My team makes it easy to build web experiences quickly and
                            improves accessibility for all our customers. I work daily in React and TypeScript.
                        </p>
                        <p>
                            Before graduating from the
                            <a href="https://www.cs.washington.edu">University of Washington Paul G. Allen School</a>
                            with a degree in computer science and a minor in mathematics, I spent 2 years working at
                            <a href="https://www.onetrust.com/blog/onetrust-acquires-integris/">Integris Software</a>, a
                            privacy and regulation automation startup, which has since been bought by OneTrust Software.
                            I spent a year as a Software Development Engineer at
                            <a href="https://aws.amazon.com/storagegateway">AWS Storage Gateway</a> on the
                            infrastructure team. Since my first programming book back in junior high, I've tried my hand
                            at everything from apps and games to websites and APIs and even some machine learning. I'm
                            an Apple fanboy, a software polyglot, and an aspiring entrepreneur.
                        </p>
                        <p>
                            I also attended the
                            <a href="https://ihopu.org/internships/one-thing/">
                                One Thing Internship at the Internation House of Prayer
                            </a>
                            in Kansas City. My passions include faith, family, and music. My faith is central to how I
                            live life and see the world around me. As a Christian, I believe that Jesus is Lord, that
                            the Bible is the Word of God, and that I am called to love those around me. I'm extremely
                            close with my family and enjoy spending time with them. I love singing, playing guitar, and
                            writing music.
                        </p>
                    </div>

                    <div id="contact" className="content">
                        I'd love to get in touch! You can reach me at
                        <a className="email">kaeden(dot)wile@outlook.com</a> or find me on
                        <a href="https://www.linkedin.com/in/kaeden-wile">LinkedIn</a> and
                        <a href="https://github.com/kaedenwile">GitHub</a>.
                    </div>
                </div>
            </div>

            <div id="footer">
                <div id="copyright">
                    <a href="https://github.com/kaedenwile/XYZWebsite">Code</a>
                    (c) 2024, Kaeden Wile
                </div>

                <img id="logo" src="/img/kw-logo.png" alt="KW Logo" className="no-select" />
            </div>
        </div>
    );
};
