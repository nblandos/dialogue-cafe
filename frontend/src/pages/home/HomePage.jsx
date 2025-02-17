import React, { useState, useRef } from 'react';
import { initialMenu, popularOrders } from './homeData';
import {
  FaArrowDown,
  FaCalendarAlt,
  FaBook,
  FaGraduationCap,
} from 'react-icons/fa';
import tubeMap from './images/tube_map.png';

const HomePage = () => {
  const [hoveredVideo, setHoveredVideo] = useState(null);
  const videoRefs = useRef({});

  const handleMouseEnter = (name) => {
    setHoveredVideo(name);
    if (videoRefs.current[name]) {
      videoRefs.current[name].contentWindow.postMessage(
        '{"event":"command","func":"playVideo","args":""}',
        '*'
      );
    }
  };

  const handleMouseLeave = (name) => {
    setHoveredVideo(null);
    if (videoRefs.current[name]) {
      videoRefs.current[name].contentWindow.postMessage(
        '{"event":"command","func":"pauseVideo","args":""}',
        '*'
      );
    }
  };

  return (
    <div className="flex bg-gray-100 p-6 pt-32">
      <div className="flex w-3/4 flex-col items-center rounded-l-lg border-r border-gray-300 bg-white p-4 text-center">
        <header className="mb-4 text-3xl font-bold">Popular Orders</header>

        {/* Popular Orders Videos Grid */}
        <div className="mb-8 grid grid-cols-3 gap-4">
          {popularOrders.map((order) => (
            <div
              key={order.name}
              className="text-center"
              onMouseEnter={() => handleMouseEnter(order.name)}
              onMouseLeave={() => handleMouseLeave(order.name)}
            >
              <p className="mb-2 text-xl font-semibold">{order.name}</p>
              <iframe
                className="w-full rounded-lg shadow-md transition-transform duration-300"
                width="315"
                height="533"
                ref={(el) => (videoRefs.current[order.name] = el)}
                src={order.video}
                title={order.name}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                  transform:
                    hoveredVideo === order.name ? 'scale(1.05)' : 'scale(1)',
                }}
              ></iframe>
            </div>
          ))}
        </div>

        {/* Links */}
        <div className="mt-4 flex w-full justify-center gap-6">
          <a
            href="/book"
            className="flex items-center space-x-2 rounded-lg bg-blue-600 px-6 py-3 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-blue-700"
          >
            <FaCalendarAlt className="text-xl" />
            <span>Book a Table</span>
          </a>
          <a
            href="/menu"
            className="flex items-center space-x-2 rounded-lg bg-green-600 px-6 py-3 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-green-700"
          >
            <FaBook className="text-xl" />
            <span>View Menu</span>
          </a>
          <a
            href="/learn"
            className="flex items-center space-x-2 rounded-lg bg-purple-600 px-6 py-3 text-white shadow-md transition-all duration-200 hover:scale-105 hover:bg-purple-700"
          >
            <FaGraduationCap className="text-xl" />
            <span>Learn Sign Language</span>
          </a>
        </div>

        {/* Divider */}
        <div className="my-8 w-full border-b border-gray-300"></div>

        {/* Tube Map Image*/}
        <div className="mt-6 flex w-full flex-col items-center space-y-2">
          <h2 className="text-3xl font-bold">Getting Here</h2>
          <div className="flex w-full items-start justify-between gap-8 px-4">
            <div className="w-2/3">
              <img
                src={tubeMap}
                alt="Tube Map"
                className="w-full rounded-lg shadow-md"
              />
            </div>
            <div className="w-1/3 space-y-6 text-left">
              <div className="space-y-2">
                <h3 className="text-xl font-semibold">Address</h3>
                <p className="text-gray-700">
                  Royal Docks Center for Sustainability
                </p>
                <p className="text-gray-700">
                  University of East London Docklands Campus
                </p>
                <p className="text-gray-700">4-6 University Way</p>
                <p className="text-gray-700">London E16 2RD</p>
              </div>

              <div className="space-y-4">
                <h3 className="text-xl font-semibold">Opening Hours</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-700">Monday-Thursday</span>
                    <span className="text-gray-700">08:00-17:00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-700">Friday</span>
                    <span className="text-gray-700">08:00-13:00</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Example Column */}
      <div className="w-1/4 rounded-r-lg border-l border-gray-300 bg-white p-8 pr-8 text-center">
        <h1 className="mb-6 text-3xl font-bold">How to give an Order</h1>
        <div className="flex flex-col items-center space-y-6">
          {[
            { name: 'Hello-Please-Thank You' },
            { name: 'Single Espresso' },
            { name: 'Goodbye' },
          ].map((item, index) => (
            <React.Fragment key={item.name}>
              <div
                className="text-center"
                onMouseEnter={() => handleMouseEnter(item.name)}
                onMouseLeave={() => handleMouseLeave(item.name)}
              >
                <p className="mb-4 text-xl font-semibold">{item.name}</p>
                <iframe
                  width="200"
                  height="300"
                  ref={(el) => (videoRefs.current[item.name] = el)}
                  src={
                    initialMenu.find((menuItem) => menuItem.name === item.name)
                      ?.video
                  }
                  title={item.name}
                  className={`rounded-lg transition-transform ${hoveredVideo === item.name ? 'scale-110' : 'scale-100'}`}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              {index < 2 && (
                <FaArrowDown className="inline-flex fill-black stroke-black text-6xl text-black" />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
