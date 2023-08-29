import React, { useEffect, useState, useRef } from 'react';
import './UserDetails.css';
import { useUserAuth } from './UserAuthContext';
import PageNotFound from './PageNotFound';
import axios from 'axios';


const UserDetails = () => {
  const jwtToken = localStorage.getItem('jwtToken')
  const config = {
    headers: {
      Authorization: `Bearer ${jwtToken}`,
    },
  };
  const photoUrl =
    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  var { userAuthData } = useUserAuth();
  userAuthData = JSON.parse(localStorage.getItem('userAuthData'));
  const customer = userAuthData.customer;

  const [accounts, setAccounts] = useState([]);
  const [selectedAccount, setSelectedAccount] = useState(null);

  useEffect(() => {
    // Fetch account details for the customer using axios
    const fetchAccountDetails = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/account/by-customer/${customer.customerId}`, config
        );
        setAccounts(response.data);
      } catch (error) {
        console.error('Error fetching account details:', error);
      }
    };

    fetchAccountDetails();
  }, [customer.customerId]);

  const handleAccountChange = (event) => {
    const selectedAccountId = event.target.value;
    setSelectedAccount(
      accounts.find((account) => account.accountId === Number(selectedAccountId))
    );
  };
  // console.log("imageupload")
    // console.error("imageupload config",config)
  // const photoUrl = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';
  const inputRef = useRef(null);
  const [image, setImage] = useState();
  const handleImageClick = () => {
    inputRef.current.click();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const imgname = event.target.files[0].name;

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = () => {
      const img = new Image();
      img.src = reader.result;

      img.onload = () => {
        const canvas = document.createElement("canvas");
        const maxSize = Math.max(img.width, img.height);
        canvas.width = maxSize;
        canvas.height = maxSize;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(
          img,
          (maxSize - img.width) / 2,
          (maxSize - img.height) / 2
        );

        canvas.toBlob(
          (blob) => {
            const file = new File([blob], imgname, {
              type: "image/png",
              lastModified: Date.now(),
            });

            console.log(file);
            setImage(file);

            // Upload the new image to the backend
            const formData = new FormData();
            formData.append('image', file);
            console.log("formData",formData)
            // axios.post(`http://localhost:8080/api/customer/${customer.customerId}/update-profile-image`, formData, {
            //       headers: {
            //           'Authorization': `Bearer ${jwtToken}`,
            //           'Content-Type': 'multipart/form-data' // Important for sending FormData
            //       }
            //   })
            //   .then(response => {
            //       if (response.status === 200) {
            //           console.log(response.data);
            //           alert('File uploaded successfully.');
            //       }
            //   })
            //   .catch(error => {
            //       console.error(error);
            //       alert('An error occurred while uploading the file.');
            //   });
          },
          "image/jpeg",
          0.8
        );
      };
    };
  };
  // console.error("userDetail config",config)

  return (
    <>
      {!useUserAuth ? (
        <PageNotFound />
      ) : (
        <div className="user-details-container">
          <div className="user-image" onClick={handleImageClick}>
            {customer.profileImage ? (
              <img src={URL.createObjectURL(customer.profileImage)} alt='user-profile' />
            ) : image ? (
              <img src={URL.createObjectURL(image)} alt='user-profile' />
            ) : (
              <img src={photoUrl} alt='user-profile-default' />
            )}
            <input
              type='file'
              accept="image/png, image/jpeg"
              ref={inputRef}
              onChange={handleImageChange}
              style={{ display: 'none' }}
            />
          </div>
          <div className="user-details">
            <h2>User Details</h2>
            <p>
              <strong>Name:</strong> {customer.fullName}
            </p>
            <p>
              <strong>Email:</strong> {customer.email}
            </p>
            <p>
              <strong>Phone:</strong> {customer.phone}
            </p>
            <select
              onChange={handleAccountChange}
              className="user-details-select"
            >
              <option value="">Select Account</option>
              {accounts.map((account) => (
                <option key={account.accountId} value={account.accountId}>
                  {account.accountId}
                </option>
              ))}
            </select>
            {selectedAccount ? (
              <p>
                <strong>Account Number:</strong> {selectedAccount.accountId}
                <br />
                <strong>Account Balance: $</strong> {selectedAccount.balance}
              </p>
            ) : null}
          </div>
        </div>
      )}
    </>
    );
}

export default UserDetails