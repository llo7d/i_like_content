import React, { useState, useEffect, useMemo, useRef } from 'react';
import './Popup.css';
import gmailFavicon from './assets/gmail.png';
import Toggle from '../../components/toggle';
import { LogoSVG } from '../../components/LogoSVG';
import { StarSVG } from '../../components/StarSVG';
import { BookSVG } from '../../components/BookSVG';
import { SelectInput } from '../../components/SelectInput';
import { BarChartSVG } from '../../components/BarChartSVG';
import { CameraLensSVG } from '../../components/CameraLensSVG';
import { GmailSVG } from '../../components/GmailSVG';
import { XCircleSVG } from '../../components/XCircleSVG';
import { LinkSVG } from '../../components/LinkSVG';

import { components } from 'react-select';

const DifficultyOptions = [
  { value: 'easy', label: 'Easy' },
  { value: 'medium', label: 'Medium' },
  { value: 'hard', label: 'Hard' },
];

const CategoryOptions = [
  { value: 'techy', label: 'Everything Tech' },
  { value: 'react', label: 'React' },
  { value: 'python', label: 'Python' },
  { value: 'javascript', label: 'Javascript' },
  { value: 'typescript', label: 'Typescript' },
  { value: 'algorithms ', label: 'Algorithms' },
];

function isCheckboxChecked(list = [], value) {
  return list.find((item) => item?.value === value);
}
const Popup = () => {
  const [category, setCategory] = useState('');
  const [isPluginActive, setIsPluginActive] = useState(false);
  const [domainChanges, setDomainChanges] = useState(10);

  const [newDomain, setNewDomain] = useState('');
  const [domains, setDomains] = useState([]);

  const inputRangeRef = useRef();
  useEffect(() => {
    // Load and set defaults
    chrome.storage.local.get(
      [
        'category',
        'isPluginActive',
        'domainChanges',
        'excludedDomains',
      ],
      function (result) {
        setCategory(result.category);
        setIsPluginActive(result.isPluginActive);
        setDomainChanges(result.domainChanges);
        setDomains(result.excludedDomains);

        console.log('result', result);
      }
    );
  }, []);

  const handleAddDomain = (e) => {
    e.preventDefault();

    // Check if the URL is already blocked
    if (newDomain && !domains.includes(newDomain)) {
      setDomains([...domains, newDomain]);
      setNewDomain('');

      // Store the new domain inside chrome storage
      chrome.storage.local.set({ excludedDomains: [...domains, newDomain] });
    }
  };

  const handleRemoveDomain = (urlToRemove) => {
    setDomains(domains.filter((url) => url !== urlToRemove));
    // Remove the domain from the chrome storage
    chrome.storage.local.set({
      excludedDomains: domains.filter((url) => url !== urlToRemove),
    });
  };

  const handleIsPluginActiveChange = (event) => {
    setIsPluginActive(event.target.checked);
    chrome.storage.local.set({ isPluginActive: event.target.checked });
  };

  const handleSliderChange = (event) => {
    const value = event.target.value;
    setDomainChanges(value);

    // Store the domainChanges inside chrome storage
    chrome.storage.local.set({ domainChanges: value });
  };


  const handleSetcategory = (value) => {
    console.log('value', value);
    setCategory(value);

    // Store the category inside chrome storage
    chrome.storage.local.set({ category: value });
  };

  function mapDomainChangesToString(domainChanges) {
    if (domainChanges >= 50 && domainChanges <= 60) {
      return 'Rarely';
    } else if (domainChanges >= 30 && domainChanges < 50) {
      return 'Somewhat';
    } else if (domainChanges >= 10 && domainChanges < 30) {
      return 'Often';
    } else {
      return 'Invalid';
    }
  }

  const processDomain = useMemo(() => {
    if (inputRangeRef?.current === null) return 0;
    const min = parseInt(inputRangeRef?.current?.min) || 10;
    const max = parseInt(inputRangeRef?.current?.max) || 60;

    const progress = ((domainChanges - min) / (max - min)) * 100;
    return progress;
  }, [domainChanges, inputRangeRef]);

  return (
    <div className="App">
      <div className="App-Container">
        <header className="relative pb-20">
          <div className="flex justify-space-between items-center">
            <div className="flex column-gap-1 items-center row-gap-1 h-fit">
              <LogoSVG />
              <StarSVG />
              <div className="flex items-center">
                <BookSVG />
                <a
                  href="https://youtu.be/HxFhqbqVTyE"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontWeight: 400,
                    lineHeight: '20px',
                    textAlign: 'left',
                    paddingLeft: '4px',
                    color: '#ffffff',
                    textDecoration: 'none',
                  }}
                  onMouseEnter={(e) => (e.target.style.color = '#cccccc')}
                  onMouseLeave={(e) => (e.target.style.color = '#ffffff')}
                >
                  How it works?
                </a>
              </div>
            </div>
            <Toggle
              value={isPluginActive}
              handleToggle={handleIsPluginActiveChange}
            />
          </div>
          <div
            className="divider absolute"
            style={{
              position: 'absolute',
              width: 'calc(100% + 40px)',
              left: '-20px',
              bottom: 0,
            }}
          ></div>
        </header>
        <main className="pt-20 main-layout">
          <div
            className="flex flex-col"
            style={{
              rowGap: '20px',
            }}
          >
            <SelectInput
              value={isCheckboxChecked(CategoryOptions, category)}
              options={CategoryOptions}
              label="Category"
              SingleValue={({ children, ...props }) => (
                <components.SingleValue {...props}>
                  <div
                    className="flex items-center"
                    style={{
                      columnGap: '8px',
                    }}
                  >
                    <CameraLensSVG />
                    {children}
                  </div>
                </components.SingleValue>
              )}
              onChange={(selected) => handleSetcategory(selected.value)}
            />

            <div>
              <label
                htmlFor="domainChanges"
                style={{
                  display: 'block',
                  marginBottom: '7px',
                  fontFamily: 'Inter',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: '20px',
                  color: '#ffffff',
                  textAlign: 'left',
                }}
              >
                Choose the frequency? {mapDomainChangesToString(domainChanges)}
              </label>
              <div
                className="flex items-center"
                style={{
                  columnGap: '12px',
                }}
              >
                <div class="input-wrapper w-full">
                  <input
                    id="domainChanges"
                    type="range"
                    min="10"
                    max="60"
                    value={domainChanges}
                    defaultValue={domainChanges}
                    onChange={handleSliderChange}
                    style={{
                      width: '100%',
                      background: `linear-gradient(to right, #635AFF ${processDomain}%, #ffffff ${processDomain}%)`,
                    }}
                    ref={(ref) => (inputRangeRef.current = ref)}
                  />
                </div>

                {/* Show the percentage of the domain changes
                <span
                  style={{
                    fontFamily: 'Inter',
                    fontSize: '14px',
                    fontWeight: 500,
                    lineHeight: '20px',
                    color: '#FFFFFF8F',
                    width: '49px',
                    textAlign: 'right',
                  }}
                >
                  {`${domainChanges} %`}
                </span> */}
              </div>
            </div>

            <form onSubmit={handleAddDomain}>
              <label htmlFor="excludeDomain" className="label text-base">
                Exclude URL
              </label>
              <div className="input-with-icon-and-button">
                <div className="input-with-icon-group w-full">
                  <LinkSVG />
                  <input
                    id="excludeDomain"
                    type="text"
                    value={newDomain}
                    onChange={(e) => setNewDomain(e.target.value)}
                    placeholder="Enter email"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddDomain}
                  style={{
                    color: `${newDomain ? 'var(--white-color)' : 'var(--dark-color-32)'
                      }`,
                  }}
                >
                  Add
                </button>
              </div>
            </form>

            <div className="list-social">
              {Array.isArray(domains) &&
                domains.map((domain, index) => (
                  <div className="list-social-item relative" key={index}>
                    {domain === 'gmail' && <GmailSVG />}
                    {domain !== 'gmail' && (
                      <img
                        src={`https://www.google.com/s2/favicons?domain_url=https://${domain}.com&size=16`}
                        alt="Favicon"
                      />
                    )}
                    <span
                      className="text-base"
                      style={{
                        textTransform: 'capitalize',
                      }}
                    >
                      {domain}
                    </span>
                    <XCircleSVG
                      className="absolute list-social-item__icon"
                      onClick={() => handleRemoveDomain(domain)}
                    />
                  </div>
                ))}
            </div>
          </div>
        </main>
        <footer>
          <div className="flex justify-center items-center w-full">
            <a
              href="https://github.com/llo7d"
              className="text-base text-dark-color-20 hover:text-dark-color-50 transition-colors duration-200"
              target="_blank"
              rel="noopener noreferrer"
            >
              Made by Looyd
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Popup;
