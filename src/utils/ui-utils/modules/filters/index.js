export  function truncate(str, frontLen, backLen) {
    if (str === null) {
        return '';
      }
      const strLen = str.length;
      const truncateStr = '....';
      if (((frontLen === 0 && backLen === 0)
      || frontLen >= strLen || backLen >= strLen
      || (frontLen + backLen)) >= strLen) {
        return str;
      } if (backLen === 0) {
        return str.slice(0, frontLen) + truncateStr;
      }
      if (backLen >= strLen) {
        return str.slice(0, backLen);
      }
      return str.slice(0, frontLen) + truncateStr + str.slice(strLen - backLen);
    }
