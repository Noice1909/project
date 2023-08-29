import React from 'react'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom';
import './Success.css'
import cancel from './assets/cancel.png'
const PageNotFound = (props) => {
	const location = useLocation();
	const queryParams = new URLSearchParams(location.search);
	const error = props.message || queryParams.get('message') || "the page you are looking for not avaible!";
	const show = props.show || queryParams.get('show') === 'true';
	const navigateTo = props.navigateTo || queryParams.get('navigateTo') || '/dashboard';
	const buttonMessage = props.buttonMessage || queryParams.get('buttonMessage') || 'dashboard';
  return (
	<>
		<div className='popup' id='error'>
			<div className='popup-content'>
				<div className='imgbox'>
					<img src={cancel} alt='checkedmark' className='img'/>
				</div>
				<div className='title'>
				<h3>Sorry :(</h3>
				</div>
				<p className='para'>{error}</p>
				{show ? (<Link className='button' id="e_button" to={navigateTo}>{buttonMessage}</Link>) : null}
			</div>
		</div>
    </>
  )
}

export default PageNotFound