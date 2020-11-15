""" Python Functions for AIFMRM ERS Report """

# required libraries
import numpy as np


# function takes in panda df tbl, datetime rDate and string indexCode which is
# one of "ALSI", "FLED", "LRGC", "MIDC", "SMLC", "TOPI", "RESI", "FINI",
# "INDI", "PCAP", "SAPY" or "ALTI" and outputs 2 numpy arrays IC containg the
# share codes and the corresponding market cap. weights
# (np.array of type float)
def GetICsAndWeights(tbl, rDate, indexCode):
    # define output arrays
    IC = []
    weights = []
    # define dictionary to map indexCode to respective column name
    indxCode2col = {"ALSI": "ALSI New", "FLED": "ALSI New",
                    "LRGC": "Index New", "MIDC": "Index New",
                    "SMLC": "Index New", "TOPI": "TOPI New",
                    "RESI": "RESI New", "FINI": "FINI New", "INDI": "INDI New",
                    "PCAP": "PCAP New", "SAPY": "SAPY New", "ALTI": "ALTI New"}
    temp_tbl = tbl[(tbl["Date"].dt.year == rDate.year) &
                   (tbl["Date"].dt.month == rDate.month) &
                   (tbl[indxCode2col[indexCode]] == indexCode)]

    # get outputs as numpy arrays
    IC = np.array(temp_tbl["Alpha"])
    weights = np.array(temp_tbl["Gross Market Capitalisation"])

    # Gross Market Capitilisation using commas instead of . for decimal point
    # use list comprehension to rectify
    # pandas reads Nulls as nan floats so essentially checking if it is a
    # float and a nan
    weights = [i if isinstance(i, float) else
               float(i.replace(",", ".")) for i in weights]

    # convery back to np.array to take advantage of vectorization
    weights = np.array(weights)
    # Note: this normalizing won't work if their is a nan in weights
    weights = weights/sum(weights)

    return IC, weights


# assuming for specific mktIndexCode
def GetBetasMktAndSpecVols(tbl, rDate, IC, mktIndexCode):
    temp_tbl = tbl[(tbl["Date"].dt.year == rDate.year) &
                   (tbl["Date"].dt.month == rDate.month) &
                   (tbl["Index"] == mktIndexCode)]
    # get rows where Instrument is contraining in IC array
    temp_tbl = temp_tbl[temp_tbl["Instrument"].isin(IC)]

    betas = temp_tbl["Beta"]

    # list comprehension to remove commas with handling for nans
    betas = [i if isinstance(i, float) else
             float(i.replace(",", ".")) for i in betas]
    betas = np.array(betas)

    specVols = np.array(temp_tbl["Unique Risk"])

    specVols = [i if isinstance(i, float) else
                float(i.replace(",", ".")) for i in specVols]
    specVols = np.array(specVols)

    # get mktVol string val
    mktVol = tbl[(tbl["Date"].dt.year == rDate.year) &
                 (tbl["Date"].dt.month == rDate.month) &
                 (tbl["Instrument"] == mktIndexCode) &
                 (tbl["Index"] == mktIndexCode)]["Total Risk"]

    # convert to float
    mktVol = float(mktVol.iloc[0].replace(",", "."))

    return betas, specVols, mktVol


# takes in float or np arrays
def CalcStats(weights, betas, mktVol, specVols):
    # assume mktVol will not be nan and that weights will not contain any nans

    # get array containing indexes of nan's from betas and specVols
    indx_nan = np.where(np.isnan(betas))[0]  # returns a tuple of arrays
    # in case nans occur at different points
    indx_nan = np.append(indx_nan, np.where(np.isnan(specVols))[0])
    indx_nan = list(set(indx_nan))  # get rid of duplicates

    # delete data points corresponding to nan values
    weights = np.delete(weights, indx_nan)
    betas = np.delete(betas, indx_nan)
    specVols = np.delete(specVols, indx_nan)

    # reshape inputs into column vectors in order to perform matrix operations
    weights = weights.reshape(-1, 1)
    betas = betas.reshape(-1, 1)
    S = np.diag(specVols)

    pfBeta = weights.T@betas
    sysCov = betas@betas.T*mktVol**2
    pfSysVol = np.sqrt(weights.T@betas@betas.T@weights*mktVol**2)
    specCov = S@S
    pfSpecVol = np.sqrt(weights.T@specCov@weights)
    totCov = sysCov + specCov
    pfVol = np.sqrt(pfSysVol**2 + pfSpecVol**2)
    # D is the diag matrix contaning the square root of the diags of totCov
    D = np.diag(np.sqrt(np.diag(totCov)))
    CorrMat = np.linalg.pinv(D)@totCov@np.linalg.pinv(D)  # using pseudoinverse
    # so that no errors are thrown for singular matrices

    return (pfBeta, sysCov, pfSysVol, specCov,
            pfSpecVol, totCov, pfVol, CorrMat, indx_nan)
