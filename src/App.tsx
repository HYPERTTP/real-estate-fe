import './App.css';
import photo from './photoReal.jpeg';

import React, { useState } from 'react';
import {
  APIProvider,
  AdvancedMarker,
  Map,
  useAdvancedMarkerRef,
  MapCameraChangedEvent,
} from '@vis.gl/react-google-maps';
import { MapHandler, PlaceAutocomplete } from './Aux';
import { useForm, SubmitHandler } from 'react-hook-form';

import 'bootstrap/dist/css/bootstrap.css';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faHome,
  faMoneyBillWave,
  faChartLine,
  faShieldAlt,
  faStar,
} from '@fortawesome/free-solid-svg-icons';

// ─── Animations ───────────────────────────────────────────────────────────────

const fadeUp = keyframes`
  from { opacity: 0; transform: translateY(24px); }
  to   { opacity: 1; transform: translateY(0); }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

// ─── Styled Components ────────────────────────────────────────────────────────

const HeroSection = styled.main`
  position: relative;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-image: url(${photo});
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  animation: ${fadeIn} 0.8s ease forwards;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(10, 16, 30, 0.55) 0%,
      rgba(10, 16, 30, 0.75) 100%
    );
  }
`;

const HeroContent = styled.div`
  position: relative;
  z-index: 2;
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1.5rem 4rem;
  text-align: center;
`;

const EyebrowText = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: #c9a84c;
  margin: 0 0 1rem;
  animation: ${fadeUp} 0.7s ease 0.1s both;
`;

const HeroHeadline = styled.h1`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: clamp(2.2rem, 5vw, 4rem);
  font-weight: 600;
  line-height: 1.15;
  color: #fff;
  margin: 0 0 1rem;
  max-width: 700px;
  animation: ${fadeUp} 0.7s ease 0.2s both;
`;

const HeroSubtitle = styled.p`
  font-family: 'DM Sans', sans-serif;
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.72);
  margin: 0 0 2.5rem;
  max-width: 460px;
  line-height: 1.7;
  animation: ${fadeUp} 0.7s ease 0.3s both;
`;

const SearchCard = styled.div`
  background: rgba(255, 255, 255, 0.97);
  border-radius: 14px;
  padding: 2rem 2rem 1.75rem;
  width: 100%;
  max-width: 520px;
  box-shadow: 0 24px 64px rgba(0, 0, 0, 0.32);
  animation: ${fadeUp} 0.7s ease 0.4s both;
`;

const SearchCardTitle = styled.p`
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.3rem;
  font-weight: 600;
  color: #0a101e;
  margin: 0 0 1.25rem;
  line-height: 1.3;
`;

const SearchCardLabel = styled.label`
  display: block;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  font-weight: 600;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #6b7280;
  margin-bottom: 0.5rem;
`;

const AutocompleteWrapper = styled.div`
  width: 100%;
  margin-bottom: 1rem;

  .autocomplete-control {
    width: 100%;
  }
`;

const EstimateButton = styled.button`
  width: 100%;
  padding: 0.9rem 1.5rem;
  background: #0a2540;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  cursor: pointer;
  transition: background 0.2s, transform 0.15s;

  &:hover {
    background: #153255;
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(0);
  }
`;

const TrustRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 0.35rem;
  margin-top: 0.9rem;
  font-family: 'DM Sans', sans-serif;
  font-size: 0.72rem;
  color: #9ca3af;
`;

const Dot = styled.span`
  width: 3px;
  height: 3px;
  border-radius: 50%;
  background: #d1d5db;
  display: inline-block;
`;

const IconStrip = styled.section`
  position: relative;
  z-index: 2;
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  padding: 2rem 1.5rem 2.5rem;
  animation: ${fadeUp} 0.7s ease 0.55s both;

  @media (max-width: 500px) {
    gap: 1.5rem;
  }
`;

const IconItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  text-align: center;
`;

const IconCircle = styled.div`
  width: 46px;
  height: 46px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.18);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #c9a84c;
  font-size: 1rem;
  transition: background 0.2s;

  &:hover {
    background: rgba(201, 168, 76, 0.18);
  }
`;

const IconLabel = styled.span`
  font-family: 'DM Sans', sans-serif;
  font-size: 0.68rem;
  color: rgba(255, 255, 255, 0.65);
  max-width: 80px;
  line-height: 1.4;
`;

const ThankYouScreen = styled.div`
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #0a2540;
  text-align: center;
  padding: 2rem;
  animation: ${fadeIn} 0.5s ease;

  h2 {
    font-family: 'Cormorant Garamond', Georgia, serif;
    font-size: 2.75rem;
    font-weight: 600;
    color: #fff;
    margin-bottom: 0.75rem;
  }

  p {
    font-family: 'DM Sans', sans-serif;
    color: rgba(255, 255, 255, 0.65);
    font-size: 1rem;
    max-width: 400px;
    line-height: 1.7;
    margin-bottom: 2rem;
  }

  button {
    background: transparent;
    color: #c9a84c;
    border: 1px solid #c9a84c;
    padding: 0.75rem 2rem;
    border-radius: 8px;
    font-family: 'DM Sans', sans-serif;
    font-size: 0.9rem;
    font-weight: 600;
    cursor: pointer;
    letter-spacing: 0.05em;
    transition: background 0.2s, color 0.2s;

    &:hover {
      background: #c9a84c;
      color: #0a2540;
    }
  }
`;

const GoldRule = styled.div`
  width: 40px;
  height: 2px;
  background: #c9a84c;
  border-radius: 2px;
  margin: 0 auto 1.5rem;
`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface IFormInput {
  firstName: string;
  Email: string;
  PhoneNumber: string;
  Bedrooms: number;
  Bathrooms: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const API_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY ?? '';

// ─── Component ────────────────────────────────────────────────────────────────

function App() {
  const [selectedPlace, setSelectedPlace] =
    useState<google.maps.places.PlaceResult | null>(null);
  const [markerRef, marker] = useAdvancedMarkerRef();
  const [showMap, setShowMap] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<IFormInput>({ mode: 'onChange' });

const BASE_URL = process.env.REACT_APP_API_URL ?? 'http://localhost:8000';

  const sendEmail = async (data: IFormInput) => {
    try {
      const response = await fetch(`${BASE_URL}/api/send-email/`, {
        method: 'POST',
        body: JSON.stringify({
          subject: 'Attention: Potential Lead',
          message: `Potential Lead Details:
            Full name: ${data.firstName}
            Email: ${data.Email}
            Phone Number: ${data.PhoneNumber}
            Bedrooms: ${data.Bedrooms}
            Bathrooms: ${data.Bathrooms}
            Address: ${selectedPlace?.formatted_address ?? 'Not provided'}`,
          recipients: ['shivdeepsingh38@gmail.com'],
        }),
      });
      console.log(response.status);
    } catch (err) {
      console.error(err);
    } finally {
      setShowMap(false);
    }
  };

  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    sendEmail(data);
    setShowThankYou(true);
  };

  const handleAddressSubmit = () => {
    setShowMap(true);
  };

  // ── Thank You ──
  if (showThankYou) {
    return (
      <ThankYouScreen>
        <GoldRule />
        <h2>Thank You</h2>
        <p>
          We've received your request. A member of our team will be in touch
          shortly with your personalized home valuation.
        </p>
        <button
          onClick={() => {
            setShowThankYou(false);
            setShowMap(false);
          }}
        >
          Back to Home
        </button>
      </ThankYouScreen>
    );
  }

  // ── Hero / Landing ──
  if (!showMap) {
    return (
      <HeroSection aria-label="Home valuation hero">


        <HeroContent>
          <EyebrowText>Free Home Valuation — GTA</EyebrowText>
          <HeroHeadline>Discover What Your Home Is Worth Today</HeroHeadline>
          <HeroSubtitle>
            Get an instant, data-driven estimate from one of the GTA's most
            trusted real estate professionals.
          </HeroSubtitle>

          <SearchCard>
            <SearchCardTitle>Enter your address to get started</SearchCardTitle>
            <SearchCardLabel htmlFor="address-input">Property Address</SearchCardLabel>
            <AutocompleteWrapper>
              <APIProvider
                apiKey={API_KEY}
                solutionChannel="GMP_devsite_samples_v3_rgmautocomplete"
              >
                <div className="autocomplete-control">
                  <PlaceAutocomplete onPlaceSelect={setSelectedPlace} />
                </div>
              </APIProvider>
            </AutocompleteWrapper>

            <EstimateButton onClick={handleAddressSubmit} type="button">
              Get My Free Estimate
            </EstimateButton>

            <TrustRow>
              <FontAwesomeIcon icon={faShieldAlt} style={{ fontSize: '0.65rem' }} />
              No commitment required
              <Dot />
              <FontAwesomeIcon icon={faStar} style={{ fontSize: '0.65rem' }} />
              500+ homes valued
              <Dot />
              Free &amp; instant
            </TrustRow>
          </SearchCard>
        </HeroContent>

        <IconStrip aria-label="Why choose us">
          <IconItem>
            <IconCircle aria-hidden="true">
              <FontAwesomeIcon icon={faHome} />
            </IconCircle>
            <IconLabel>Local market expertise</IconLabel>
          </IconItem>
          <IconItem>
            <IconCircle aria-hidden="true">
              <FontAwesomeIcon icon={faMoneyBillWave} />
            </IconCircle>
            <IconLabel>Accurate pricing data</IconLabel>
          </IconItem>
          <IconItem>
            <IconCircle aria-hidden="true">
              <FontAwesomeIcon icon={faChartLine} />
            </IconCircle>
            <IconLabel>Live market trends</IconLabel>
          </IconItem>
        </IconStrip>
      </HeroSection>
    );
  }

  // ── Map + Contact Form ──
  return (
    <div>
      <div style={{ height: '55vh', width: '100%' }}>
        <APIProvider apiKey={API_KEY} onLoad={() => console.log('Maps API loaded.')}>
          <Map
            mapId="bf51a910020fa25a"
            defaultZoom={13}
            defaultCenter={{ lat: -33.860664, lng: 151.208138 }}
            onCameraChanged={(ev: MapCameraChangedEvent) =>
              console.log('camera changed:', ev.detail.center, 'zoom:', ev.detail.zoom)
            }
          >
            <AdvancedMarker ref={markerRef} position={null} />
          </Map>
          <MapHandler place={selectedPlace} marker={marker} />
        </APIProvider>
      </div>

      <section className="contact-section" aria-label="Contact information form">
        <div className="contact-inner">
          <p className="contact-eyebrow">Almost there</p>
          <h2 className="contact-heading">Tell us how to reach you</h2>
          <p className="contact-sub">
            We'll send your personalized home valuation report directly to you.
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="contact-form"
            noValidate
          >
            <div className="field-group">
              <label className="field-label" htmlFor="firstName">
                Full Name
              </label>
              <input
                id="firstName"
                {...register('firstName', {
                  required: 'Name is required',
                  minLength: {
                    value: 2,
                    message: 'Name must be at least 2 characters',
                  },
                })}
                className={`field-input${errors.firstName ? ' field-input--error' : ''}`}
                placeholder="Jane Smith"
              />
              {errors.firstName && (
                <span className="field-error">{errors.firstName.message}</span>
              )}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="Email">
                Email Address
              </label>
              <input
                id="Email"
                type="email"
                {...register('Email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
                className={`field-input${errors.Email ? ' field-input--error' : ''}`}
                placeholder="jane@example.com"
              />
              {errors.Email && (
                <span className="field-error">{errors.Email.message}</span>
              )}
            </div>

            <div className="field-group">
              <label className="field-label" htmlFor="PhoneNumber">
                Phone Number
              </label>
              <input
                id="PhoneNumber"
                type="tel"
                {...register('PhoneNumber', {
                  required: 'Phone number is required',
                  pattern: {
                    value:
                      /^(\+1|1)?[\s-]?\(?(?:(?:2(?:04|[23]6|[48]9|50)|3(?:06|43|65)|4(?:03|1[68]|3[178]|50)|5(?:06|1[49]|48|79|8[17])|6(?:04|13|39|47)|7(?:0[59]|78|8[02])|8(?:45|49|73|9[2-6])|9(?:80|9[69]))|5(?:58|6[67]|74|8[36-9]|9[1-9])|6(?:0[0-5]|1[0-7]|2[2-7]|3[2-8]|4[13-9]|5[0-4]|6[0-6]|7[0-2])|7(?:0[1-9]|1[2-8]|2[2-4]|3[2-9]|4[2-5]|5[3-9]|73|80)|8(?:0[2-9]|1[2-7]|2[02-5]|3[27-9]|4[2-7]|5[04-9]|6[2-9]|7[2-4]|8[0-4])|9(?:0[89]|1[2-6]|2[2-5]|3[0-7]|4[04-9]|5[0-6]|6[2-9]|7[0-4]|8[02-7]))\)?[\s.-]?\d{3}[\s.-]?\d{4}$/,
                    message: 'Please enter a valid Canadian phone number',
                  },
                })}
                className={`field-input${errors.PhoneNumber ? ' field-input--error' : ''}`}
                placeholder="(416) 555-0100"
              />
              {errors.PhoneNumber && (
                <span className="field-error">{errors.PhoneNumber.message}</span>
              )}
            </div>

            <div className="field-row">
              <div className="field-group">
                <label className="field-label" htmlFor="Bedrooms">
                  Bedrooms
                </label>
                <input
                  id="Bedrooms"
                  type="number"
                  min={1}
                  max={20}
                  {...register('Bedrooms', {
                    required: 'Required',
                    min: { value: 1, message: 'Min 1' },
                    max: { value: 20, message: 'Max 20' },
                    valueAsNumber: true,
                  })}
                  className={`field-input${errors.Bedrooms ? ' field-input--error' : ''}`}
                  placeholder="3"
                />
                {errors.Bedrooms && (
                  <span className="field-error">{errors.Bedrooms.message}</span>
                )}
              </div>

              <div className="field-group">
                <label className="field-label" htmlFor="Bathrooms">
                  Bathrooms
                </label>
                <input
                  id="Bathrooms"
                  type="number"
                  min={1}
                  max={20}
                  {...register('Bathrooms', {
                    required: 'Required',
                    min: { value: 1, message: 'Min 1' },
                    max: { value: 20, message: 'Max 20' },
                    valueAsNumber: true,
                  })}
                  className={`field-input${errors.Bathrooms ? ' field-input--error' : ''}`}
                  placeholder="2"
                />
                {errors.Bathrooms && (
                  <span className="field-error">{errors.Bathrooms.message}</span>
                )}
              </div>
            </div>

            <button type="submit" className="submit-btn" disabled={!isValid}>
              Send My Valuation Report
            </button>
          </form>
        </div>
      </section>
    </div>
  );
}

export default App;