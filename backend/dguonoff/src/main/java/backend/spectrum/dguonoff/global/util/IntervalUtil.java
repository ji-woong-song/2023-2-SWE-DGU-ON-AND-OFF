package backend.spectrum.dguonoff.global.util;


import backend.spectrum.dguonoff.domain.admin.dto.common.PeriodDTO;

public class IntervalUtil {
    public static boolean isOverlapped(PeriodDTO period1, PeriodDTO period2) {
        int s1s2Compare = period1.getStart().compareTo(period2.getStart());
        int e1e2Compare = period1.getEnd().compareTo(period2.getEnd());
        int e1s2Compare = period1.getEnd().compareTo(period2.getStart());
        int s1e2Compare = period1.getStart().compareTo(period2.getEnd());

        if (s1s2Compare == 0 || e1e2Compare == 0)
            return true;
        else if (s1s2Compare < 0 && e1s2Compare > 0)
            return true;
        else if (s1s2Compare > 0 && s1e2Compare < 0)
            return true;
        return false;
    }
}
