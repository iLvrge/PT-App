import React, {
  useCallback,
  useEffect,
  useState,
  useRef,
  useMemo,
} from "react";
import { useSelector, useDispatch } from "react-redux";
import { Paper } from "@mui/material";
import Loader from "../Loader";
import useStyles from "./styles";
import VirtualizedTable from "../VirtualizedTable";
import { DEFAULT_CUSTOMERS_LIMIT } from "../../../api/patenTrack2";
import {
  getAssetTypeAssignmentAssets,  
  setAssetsIllustration,
  setSelectedAssetsPatents,
  setChildSelectedAssetsPatents,
  setCommentsEntity,
  getChannelID,
  setSelectedAssetsTransactions,
  setMainCompaniesRowSelect,
  setAssetTypeSelectedRow,
  setAssetTypeCustomerSelectedRow,
  setChildSelectedAssetsTransactions,
} from "../../../actions/patentTrackActions2";

import {
  assetLegalEvents,
  assetFamily,
  setConnectionBoxView,
  setPDFView,
} from "../../../actions/patenTrackActions";

import {
  toggleUsptoMode,
  toggleFamilyMode,
  toggleFamilyItemMode,
  toggleLifeSpanMode,
} from "../../../actions/uiActions";

import { numberWithCommas } from "../../../utils/numbers";

const ChildTable = ({ transactionId, headerRowDisabled }) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [offset, setOffset] = useState(0);
  const [rowHeight, setRowHeight] = useState(40);
  const [width, setWidth] = useState(800);
  const tableRef = useRef();
  const [counter, setCounter] = useState(DEFAULT_CUSTOMERS_LIMIT);
  const [selectedAll, setSelectAll] = useState(false);
  const [selectItems, setSelectItems] = useState([]);
  const [selectedRow, setSelectedRow] = useState([]);
  const [data, setData] = useState([]);
  const assetTypesSelected = useSelector(
    state => state.patenTrack2.assetTypes.selected,
  );
  const assetTypesSelectAll = useSelector(
    state => state.patenTrack2.assetTypes.selectAll,
  );
  const selectedCompanies = useSelector(
    state => state.patenTrack2.mainCompaniesList.selected,
  );
  const selectedCompaniesAll = useSelector(
    state => state.patenTrack2.mainCompaniesList.selectAll,
  );
  const selectedAssetCompanies = useSelector(
    state => state.patenTrack2.assetTypeCompanies.selected,
  );
  const selectedAssetCompaniesAll = useSelector(
    state => state.patenTrack2.assetTypeCompanies.selectAll,
  );
  const assetAssignments = useSelector(
    state => state.patenTrack2.assetTypeAssignments.list,
  );
  const assetTypeAssignmentAssetsLoading = useSelector(
    state => state.patenTrack2.assetTypeAssignmentAssets.loading,
  );
  const assetTypeAssignmentLoadingAssets = useSelector(
    state => state.patenTrack2.assetTypeAssignmentAssets.loading_assets,
  );

  const selectedAssetAssignments = useSelector(
    state => state.patenTrack2.assetTypeAssignments.selected,
  );
  const selectedAssetAssignmentsAll = useSelector(
    state => state.patenTrack2.assetTypeAssignments.selectAll,
  );
  const childSelectedAssetsPatents = useSelector(
    state => state.patenTrack2.childSelectedAssetsPatents,
  );
  const selectedCategory = useSelector(state => state.patenTrack2.selectedCategory);  

  const COLUMNS = [
    /* {
      width: 29,
      label: "",
      dataKey: "asset",
      role: "checkbox",
      disableSort: true,
    }, */
    {
      width: 100,
      label: "Assets",
      dataKey: "asset",
      staticIcon: "US",
      format: numberWithCommas,
      align: "left",
      paddingLeft: '20px'    
    },
  ];

  useEffect(() => {
    if (childSelectedAssetsPatents.length == 0) {
      setSelectedRow([]);
    }
  }, [childSelectedAssetsPatents]);

  useEffect(() => {
    if (assetAssignments.length > 0) {
      let items = [];
      const findIndex = assetAssignments.findIndex(
        assignment => parseInt(assignment.rf_id) === parseInt(transactionId),
      );
      if (
        findIndex >= 0 &&
        assetAssignments[findIndex]["children"] != undefined &&
        assetAssignments[findIndex]["children"]["list"]
      ) {
        items = [...assetAssignments[findIndex]["children"]["list"]];
      }
      setData(items);
    }
  }, [assetAssignments]);

  useEffect(() => {
    if (transactionId != null) {
      dispatch(getAssetTypeAssignmentAssets(transactionId, selectedCategory != '' ? selectedCategory : '', false));
    }
  }, [dispatch, selectedCategory]);

  const callSelectedAssets = ({ grant_doc_num, appno_doc_num }) => {
    const selectedItems = [];
    if (grant_doc_num != "") {
      selectedItems.push(grant_doc_num);
    }
    if (appno_doc_num != "") {
      selectedItems.push(appno_doc_num);
    }
    setSelectedRow(selectedItems);
  };

  const handleOnClick = useCallback(
    ({ grant_doc_num, appno_doc_num }) => {
      /*TV, Comment, Family, FamilyItem, getChannelID Legal Events */
      if (
        childSelectedAssetsPatents[0] != grant_doc_num ||
        childSelectedAssetsPatents[1] != appno_doc_num
      ) {
        callSelectedAssets({ grant_doc_num, appno_doc_num });
        dispatch(setConnectionBoxView(false));
        dispatch(setSelectedAssetsTransactions([]));
        dispatch(setMainCompaniesRowSelect([]));
        dispatch(setAssetTypeSelectedRow([]));
        dispatch(setAssetTypeCustomerSelectedRow([]));
        dispatch(setChildSelectedAssetsTransactions([]));
        dispatch(setPDFView(false));
        dispatch(toggleUsptoMode(false));
        dispatch(toggleLifeSpanMode(false));
        dispatch(toggleFamilyMode(true));
        dispatch(toggleFamilyItemMode(true));
        dispatch(setSelectedAssetsPatents([]));
        dispatch(setChildSelectedAssetsPatents([grant_doc_num, appno_doc_num]));
        dispatch(
          setAssetsIllustration({
            type: "patent",
            id: grant_doc_num || appno_doc_num,
          }),
        );
        dispatch(
          setCommentsEntity({
            type: "asset",
            id: grant_doc_num || appno_doc_num,
          }),
        );
        dispatch(assetLegalEvents(appno_doc_num, grant_doc_num));
        dispatch(assetFamily(appno_doc_num));
        dispatch(getChannelID(grant_doc_num, appno_doc_num));
      }
    },
    [dispatch, childSelectedAssetsPatents],
  );

  /**
   * Click checkbox
   */
  const handleClickSelectCheckbox = useCallback(
    (e, row) => {
      e.preventDefault();
      const { checked } = e.target;
      let updateSelected = [...childSelectedAssetsPatents],
        oldSelection = [...selectItems];
      if (checked !== undefined) {
        if (checked === true) {
          updateSelected.push([
            row.grant_doc_num,
            row.appno_doc_num,
            "",
            row.fee_code,
            row.fee_amount,
          ]);
          if (row.grant_doc_num != "") {
            oldSelection.push(row.grant_doc_num);
          }
          if (row.appno_doc_num != "") {
            oldSelection.push(row.appno_doc_num);
          }
        } else {
          updateSelected = childSelectedAssetsPatents.filter(
            asset => asset[1] !== parseInt(row.appno_doc_num),
          );
          if (row.grant_doc_num != "") {
            oldSelection = oldSelection.filter(
              asset => asset !== row.grant_doc_num,
            );
          }
          if (row.appno_doc_num != "") {
            oldSelection = oldSelection.filter(
              asset => asset !== row.appno_doc_num,
            );
          }
        }
        setSelectItems(prevItems =>
          prevItems.includes(row.appno_doc_num)
            ? prevItems.filter(item => item !== row.appno_doc_num)
            : [...prevItems, row.appno_doc_num],
        );
      } else {
        handleOnClick(row);
      }      
    },
    [dispatch, selectItems],
  );

  /**
   * Click All checkbox
   */

  const onHandleSelectAll = useCallback(
    (event, row) => {
      event.preventDefault();
      /* const { checked } = event.target;
        if(checked === false) {
            setSelectItems([])
        } else if( checked === true ){
            let items = [], list = [];
            if(standalone && assetTypeAssignmentAssets.length > 0) {   
                list = [...assetTypeAssignmentAssets]  
            } else if(!standalone && data.length > 0) {  
                list = [...data]  
            }  
            const promise = list.map( item => items.push(item.grant_doc_num != '' ? item.grant_doc_num : item.appno_doc_num))
            Promise.all(promise)
            setSelectItems(items)          
        }
        setSelectAll(checked) */
    },
    [dispatch, data],
  );

  if (assetTypeAssignmentLoadingAssets) return <Loader />;

  return (
    <Paper className={classes.root} square id={`assets_type_assignment_assets`}>
      <VirtualizedTable
        classes={classes}
        selected={selectItems}
        rowSelected={selectedRow}
        selectedKey={"grant_doc_num"}
        optionalKey={"appno_doc_num"}
        rows={data}
        rowHeight={rowHeight}
        headerHeight={rowHeight}
        columns={COLUMNS}
        onSelect={handleClickSelectCheckbox}
        onSelectAll={onHandleSelectAll}
        defaultSelectAll={selectedAll}
        disableHeader={headerRowDisabled}
        responsive={false}
        noBorderLines={true}
        width={width}
        containerStyle={{
          width: "100%",
          maxWidth: "100%",
        }}
        style={{
          width: "100%",
        }}
      />
    </Paper>
  );
};

export default ChildTable;
