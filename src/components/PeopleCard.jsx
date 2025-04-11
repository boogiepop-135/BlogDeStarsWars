import React from 'react';
import useGlobalReducer from '../hooks/useGlobalReducer';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './PeopleCard.css'; 
const PeopleCard = ({ item }) => {
    const { store, dispatch } = useGlobalReducer();
    const [person, setPerson] = useState({});
    const [isHovered, setIsHovered] = useState(false);

    const getPersonDetail = async () => {
        try {
            const response = await fetch("https://www.swapi.tech/api/people/" + item.uid);
            if (!response.ok) throw new Error("Error al consultar el endpoint 'people/:uid'");
            const data = await response.json();
            setPerson(data.result.properties);
        } catch (error) {
            console.log(error);
        }
    };

    const isFavorite = store.favorites.some(fav => fav.name === item.name);

    const checkFavorite = (e) => {
        e.stopPropagation(); 
        dispatch({ 
            type: isFavorite ? 'remove_from_favorite' : 'add_to_favorite', 
            payload: { uid: item.uid, name: item.name } 
        });
    };

    const imageUrl = `https://vieraboschkova.github.io/swapi-gallery/static/assets/img/people/${item.uid}.jpg`;

    useEffect(() => {
        getPersonDetail();
    }, []);

    return (
        <div 
            className={`people-card ${isHovered ? 'hovered' : ''}`}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <div className="card-image-container">
                <img 
                    src={imageUrl} 
                    alt={item.name} 
                    className="card-image"
                />
                {isHovered && (
                    <div className="card-glow"></div>
                )}
            </div>
            <div className="card-info">
                <h3 className="card-name">{item.name}</h3>
                <div className="card-details">
                    <p><span className="detail-label">Gender:</span> {person.gender}</p>
                    <p><span className="detail-label">Hair:</span> {person.hair_color}</p>
                    <p><span className="detail-label">Eyes:</span> {person.eye_color}</p>
                </div>
                <div className="card-actions">
                    <Link 
                        to={`/item/${item.uid}`} 
                        className="card-button"
                    >
                        Learn more!
                    </Link>
                    <button 
                        onClick={checkFavorite}
                        className={`favorite-button ${isFavorite ? 'active' : ''}`}
                        aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                    >
                        <i className={`fa-heart ${isFavorite ? 'fa-solid' : 'fa-regular'}`} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PeopleCard;