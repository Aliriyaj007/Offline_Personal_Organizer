import React, { useState } from 'react';
import { TVShow } from '../../types';
import TVShowList from './TVShowList';
import TVShowDetail from './TVShowDetail';

interface TVShowTrackerProps {
  tvShows: TVShow[];
  setTvShows: (value: TVShow[] | ((val: TVShow[]) => TVShow[])) => void;
  onDeleteShow: (show: TVShow) => void;
}

const TVShowTracker: React.FC<TVShowTrackerProps> = ({ tvShows, setTvShows, onDeleteShow }) => {
  const [selectedShowId, setSelectedShowId] = useState<string | null>(null);

  const handleSelectShow = (id: string) => {
    setSelectedShowId(id);
  };

  const handleBackToList = () => {
    setSelectedShowId(null);
  };

  const handleSaveShow = (showData: TVShow) => {
    setTvShows(prev => {
      const exists = prev.some(s => s.id === showData.id);
      if (exists) {
        return prev.map(s => (s.id === showData.id ? showData : s));
      }
      return [showData, ...prev];
    });
  };
  
  const handleDeleteAndGoBack = (show: TVShow) => {
      onDeleteShow(show);
      handleBackToList();
  }

  const selectedShow = selectedShowId ? tvShows.find(s => s.id === selectedShowId) : null;

  if (selectedShow) {
    return (
      <TVShowDetail
        show={selectedShow}
        onBack={handleBackToList}
        onSave={handleSaveShow}
        onDelete={handleDeleteAndGoBack}
      />
    );
  }

  return (
    <TVShowList
      tvShows={tvShows}
      setTvShows={setTvShows}
      onDeleteShow={onDeleteShow}
      onSelectShow={handleSelectShow}
    />
  );
};

export default TVShowTracker;
