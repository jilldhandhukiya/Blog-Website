import { useState, useContext } from 'react';
import { Navigate } from 'react-router-dom';
import './BlogLogin.css';
import user_icon from '../Assets/usernameimage.png';
import password_icon from '../Assets/passwordimage.png';
import leftCircles from '../Assets/leftcircles.svg';
import rightCircles from '../Assets/rightcircles.svg';
import askitallName from '../Assets/askitallname.svg';
import askitallLogo from '../Assets/askitalllogo.svg';
import aboveFooterImage from '../Assets/abovefooterimage.svg';
import thinkingBlog from '../Assets/thinkingblog.svg';
import blogpostRight from '../Assets/blogpostright.svg';
import Loader from "../Loader/Loader";
import { AuthContext } from '../Routes/AuthContext';

const BlogLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [doRedirect, setRedirect] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setLoading] = useState(false);
  const { setAuth } = useContext(AuthContext);

  

  const handleLogin = async (event) => {
    event.preventDefault();

    if (username && password) {
      try {
        setLoading(true);
        const response = await fetch('http://127.0.0.1:5000/api/blog/user', {
          method: 'POST',
          body: JSON.stringify({ username, password }),
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
        });

        if (response.ok) {
          const data = await response.json();
          setAuth({ username: data.username, id: data.id });
          setRedirect(true);
        } else {
          const errorData = await response.json();
          setErrorMessage(errorData.message || 'Invalid username or password');
        }
      } catch (err) {
        setErrorMessage('An error occurred while logging in. Please try again.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    } else {
      setErrorMessage('Please enter both username and password');
    }
  };


  if (doRedirect) {
    return <Navigate to="/" />;
  }


  return (
    <div className="login-container">
      <div className="bottom-rectangle"></div>
      <img src={leftCircles} alt="Left Circles" className="top-left-circles" />
      <img src={rightCircles} alt="Right Circles" className="top-right-circles" />
      <img src={askitallName} alt="Askitall Name" className="askitall-name" />
      <img src={askitallLogo} alt="Askitall Logo" className="askitall-logo" />
      <img src={aboveFooterImage} alt="Above Footer" className="above-footer-image" />
      <img src={thinkingBlog} alt="Thinking Blog" className="thinking-blog" />
      <img src={blogpostRight} alt="Blog Post Right" className="blogpost-right" />

      <h1 className="blogpage-title">ASKITALL BLOG</h1>
      <h2>LOGIN</h2>
      <p>Login to your account to continue with your Blogs</p>
      {errorMessage && 
<div className="error">
    <div className="error__icon">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" viewBox="0 0 24 24" height="24" fill="none"><path fill="#393a37" d="m13 13h-2v-6h2zm0 4h-2v-2h2zm-1-15c-1.3132 0-2.61358.25866-3.82683.7612-1.21326.50255-2.31565 1.23915-3.24424 2.16773-1.87536 1.87537-2.92893 4.41891-2.92893 7.07107 0 2.6522 1.05357 5.1957 2.92893 7.0711.92859.9286 2.03098 1.6651 3.24424 2.1677 1.21325.5025 2.51363.7612 3.82683.7612 2.6522 0 5.1957-1.0536 7.0711-2.9289 1.8753-1.8754 2.9289-4.4189 2.9289-7.0711 0-1.3132-.2587-2.61358-.7612-3.82683-.5026-1.21326-1.2391-2.31565-2.1677-3.24424-.9286-.92858-2.031-1.66518-3.2443-2.16773-1.2132-.50254-2.5136-.7612-3.8268-.7612z"></path></svg>
    </div>
    <div className="error__title">{errorMessage}</div>
</div>}
      <form onSubmit={handleLogin}>
        <div className="input-group">
          <img src={user_icon} alt="User Icon" className="icon" />
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className="input-group">
          <img src={password_icon} alt="Password Icon" className="icon" />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? <Loader /> : "Login Now"}
        </button>
      </form>
    </div>
  );
};

export default BlogLogin;
