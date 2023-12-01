package backend.spectrum.dguonoff.domain.user.service;

import backend.spectrum.dguonoff.DAO.Bookmark;
import backend.spectrum.dguonoff.DAO.Facility;
import backend.spectrum.dguonoff.DAO.User;
import backend.spectrum.dguonoff.DAO.identifier.FacilityPK;
import backend.spectrum.dguonoff.domain.admin.dto.common.FacilityKeyDTO;
import backend.spectrum.dguonoff.domain.facility.repository.FacilityRepository;
import backend.spectrum.dguonoff.domain.user.dto.BookmarkRequest;
import backend.spectrum.dguonoff.domain.user.exception.UserNotFoundException;
import backend.spectrum.dguonoff.domain.user.repository.UserRepository;
import backend.spectrum.dguonoff.global.error.Exception.BusinessException;
import backend.spectrum.dguonoff.global.statusCode.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserBookmarkService {
    private final UserRepository userRepository;
    private final FacilityRepository facilityRepository;

    @Transactional
    public void enrollBookmark(String userId, BookmarkRequest request) {
        Bookmark newBookmark = fromUserIdAndFacilityId(userId, request.getFacility());
        User user = newBookmark.getUserId();
        if (user.getBookmarks().contains(newBookmark))
            throw new BusinessException(ErrorCode.DUP_BOOKMARK);
        user.addBookmark(newBookmark);
        userRepository.save(user);
    }

    @Transactional
    public void removeBookmark(String userId, BookmarkRequest request) {
        Bookmark targetBookmark = fromUserIdAndFacilityId(userId, request.getFacility());
        User user = targetBookmark.getUserId();
        if (!user.getBookmarks().contains(targetBookmark))
            throw new BusinessException(ErrorCode.NO_BOOKMARK);
        user.getBookmarks().remove(targetBookmark);
        userRepository.save(user);
    }

    private Bookmark fromUserIdAndFacilityId(String userId, FacilityKeyDTO facilityKey) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException(ErrorCode.NOT_EXIST_USER));
        Facility facility = facilityRepository.findById(
                new FacilityPK(facilityKey.getBuildingName(), facilityKey.getId()))
                .orElseThrow(() -> new BusinessException(ErrorCode.NOT_EXIST_FACILITY));
        return new Bookmark(user, facility);
    }
}
